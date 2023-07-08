'use strict';
const { Controller } = require('egg');

class OrdersController extends Controller {
  async queryAllOrders() {
    const { ctx, app } = this;
    const { Op } = ctx.model.Sequelize;
    let { keyword } = ctx.request.body;
    if (keyword && typeof keyword === 'string') {
      keyword = keyword.trim();
    } else {
      keyword = '';
    }

    try {
      // 查询购物车与商品信息
      const orders = await ctx.service.orders.findAll({}, {
        attributes: [ 'orderCode', 'shoppingCartCode', 'totalCount', 'totalPrice', 'expressWay', 'expressCode', 'status', 'createdAt' ],
        order: [[ 'updatedAt', 'desc' ]],
        where: {
          [Op.or]: [
            { orderCode: { [Op.like]: '%' + keyword + '%' } },
            { shoppingCartCode: { [Op.like]: '%' + keyword + '%' } },
            { expressCode: { [Op.like]: '%' + keyword + '%' } },
          ],
        },
        include: [{
          model: app.model.Goods,
          as: 'goods',
          attributes: [ 'goodsCode', 'goodsTitle' ],
          where: {
            [Op.or]: [
              { goodsCode: { [Op.like]: '%' + keyword + '%' } },
              { goodsTitle: { [Op.like]: '%' + keyword + '%' } },
            ],
          },
          through: {
            attributes: [ 'buyCount', 'goodsPrice' ],
          },
          order: [[ 'updatedAt', 'desc' ]],
          include: [{
            model: app.model.GoodsPictures,
            as: 'pictures',
            attributes: [ 'pictureCode', 'pictureUrl' ],
            through: {
              attributes: [],
            },
          }],
        }],
      });

      return ctx.helper.responseSuccess({ data: orders });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  async addOrder() {
    const { ctx, app } = this;
    const { shoppingCartCode, expressWay, expressCode, orderStatus } = ctx.request.body;

    if (!shoppingCartCode) {
      return ctx.helper.responseError({ message: '购物车编码不能为空' });
    }
    if (orderStatus && !ctx.service.orders.status[orderStatus]) {
      return ctx.helper.responseError({ message: '订单状态不合法' });
    }

    let transaction;
    try {
      // 查询购物车商品信息
      const shoppingCart = await ctx.service.shoppingCarts.findOne({}, {
        attributes: [ 'shoppingCartCode' ],
        where: {
          shoppingCartCode,
        },
        include: [{
          model: app.model.Goods,
          as: 'goods',
          attributes: [ 'goodsCode', 'goodsPrice', 'goodsTitle', 'goodsInventory' ],
          through: {
            attributes: [ 'buyCount', 'selected' ],
            where: {
              selected: 1,
            },
          },
        }],
      });

      // 校验购物车信息
      if (!shoppingCart) {
        return ctx.helper.responseError({ message: '购物车不存在，请刷新页面再试' });
      }

      // 校验是否选择了商品
      if (!shoppingCart.goods || shoppingCart.goods.length < 1) {
        return ctx.helper.responseError({ message: '请先选购商品' });
      }

      // 校验商品库存，同时计算订单总数和总价
      let totalPrice = 0;
      let totalCount = 0;
      for (let i = 0; i < shoppingCart.goods.length; i++) {
        const { goodsInventory, goodsTitle, goodsPrice, goodsShoppingCartsRelations } = shoppingCart.goods[i];
        if (goodsInventory < goodsShoppingCartsRelations.buyCount) {
          return ctx.helper.responseError({ message: `您选购的商品“${goodsTitle}”库存不足` });
        }
        totalCount += goodsShoppingCartsRelations.buyCount;
        totalPrice += goodsPrice;
      }

      // 启动事务
      transaction = await ctx.model.transaction();

      // 创建订单信息
      const orderCode = await ctx.service.orders.generateOrderCode();
      const orderInfo = {
        orderCode,
        shoppingCartCode,
        expressWay,
        expressCode,
        totalCount,
        totalPrice,
        status: orderStatus || ctx.service.orders.status.WAIT_PAY,
      };
      await ctx.service.orders.create(orderInfo, { transaction });

      // 创建订单与商品关联关系
      const relations = [];
      shoppingCart.goods.forEach(goods => {
        relations.push({
          orderCode,
          goodsCode: goods.goodsCode,
          shoppingCartCode,
          goodsPrice: goods.goodsPrice,
          buyCount: goods.goodsShoppingCartsRelations.buyCount,
        });
      });
      await ctx.service.ordersGoodsRelations.bulkCreate(relations, { transaction });

      // 提交事务
      transaction.commit();

      return ctx.helper.responseSuccess({ data: shoppingCart });
    } catch (error) {
      // 回滚事务
      transaction.rollback();
      return ctx.helper.responseError({}, error);
    }
  }


  async checkOrderBeforeUpdate(orderCode, orderStatus) {
    const { ctx, app } = this;

    // 参数校验
    if (!orderCode) {
      return { message: '订单编码不能为空' };
    }

    try {
      // 查询订单信息
      const order = await ctx.service.orders.findOne({ orderCode }, {
        attributes: [ 'orderCode', 'expressWay', 'expressCode', 'status' ],
        include: [{
          model: app.model.Goods,
          as: 'goods',
          attributes: [ 'goodsCode', 'goodsPrice', 'goodsTitle', 'goodsInventory' ],
          through: {
            attributes: [ 'buyCount' ],
          },
        }],
      });

      // 校验订单是否存在
      if (!order) {
        return { message: '订单不存在，请刷新页面再试' };
      }
      if (orderStatus && !ctx.service.orders.status[orderStatus]) {
        return { message: '订单状态不合法，请检查' };
      }

      // 校验订单状态，待收货、已完成、已取消时不可修改任何信息
      const { WAIT_PAY, WAIT_SEND, WAIT_GET, FINISHED, CANCELED } = ctx.service.orders.status;
      if (WAIT_GET === order.status) {
        return { message: '订单已发货，不可修改' };
      }
      if ([ FINISHED, CANCELED ].includes(order.status)) {
        return { message: '订单已完成，不可修改' };
      }

      // 确保订单状态不可逆
      const orderStatusIndex = {
        [WAIT_PAY]: 1,
        [WAIT_SEND]: 2,
        [WAIT_GET]: 3,
        [FINISHED]: 4,
        [CANCELED]: 5,
      };
      if (orderStatus && orderStatusIndex[orderStatus] < orderStatusIndex[order.status]) {
        return { message: '订单状态不可逆，请检查' };
      }

      return { success: true, order };
    } catch (error) {
      console.error(error);
      return { message: '系统异常，请稍后再试' };
    }
  }

  async updateOrderBaseInfo() {
    const { ctx } = this;
    const { orderCode, orderStatus, expressWay, expressCode } = ctx.request.body;

    // 检查参数
    if (!orderStatus && !expressWay && !expressCode) {
      return ctx.helper.responseError({ message: '参数不能为空，请检查' });
    }
    // 检查订单基础信息
    const checkResult = await this.checkOrderBeforeUpdate(orderCode, orderStatus);
    if (!checkResult || !checkResult.success) {
      return ctx.helper.responseError({ message: checkResult.message });
    }
    // 检查订单状态参数
    if (orderStatus && !ctx.service.orders.status[orderStatus]) {
      return ctx.helper.responseError({ message: '订单状态不合法，请检查' });
    }

    try {
      const { order } = checkResult;

      // 更新订单基础信息
      await ctx.service.orders.update({
        status: orderStatus,
        expressWay: expressWay || order.expressWay,
        expressCode: expressCode || order.expressCode,
      }, { orderCode: order.orderCode });

      return ctx.helper.responseSuccess({ data: true });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  async updateOrderGoodsBuyCount() {
    const { ctx } = this;
    const { orderCode, goodsCode, buyCount } = ctx.request.body;

    // 检查订单基础信息
    const checkResult = await this.checkOrderBeforeUpdate(orderCode);
    if (!checkResult.success) {
      return ctx.helper.responseError({ message: checkResult.message });
    }
    // 检查物流参数
    if (!goodsCode) {
      return ctx.helper.responseError({ message: '商品编码不能为空' });
    }
    if (typeof buyCount !== 'number') {
      return ctx.helper.responseError({ message: '购买数量只能是数字' });
    }

    try {
      const { order } = checkResult;

      // 校验是否选择了商品
      if (!order.goods || order.goods.length < 1) {
        return ctx.helper.responseError({ message: '请先选购商品' });
      }

      // 校验订单状态，仅待付款状态下可以修改商品信息
      const { WAIT_PAY } = ctx.service.orders.status;
      if (order.status !== WAIT_PAY) {
        return ctx.helper.responseError({ message: '订单已付款，不允许修改' });
      }

      // 可修改商品信息时，变更购买的商品和商品数量
      if (buyCount < 1) {
        // 购买数量小于 1 时删除商品
        await ctx.service.ordersGoodsRelations.destroy({ orderCode, goodsCode });
        return ctx.helper.responseSuccess({ data: true });
      }
      // 更新商品数量
      const orderGoods = order.goods.find(goodsItem => goodsItem.goodsCode === goodsCode);
      if (!orderGoods) {
        // 商品不存在或者已下架时，移除订单中的商品后提示
        await ctx.service.ordersGoodsRelations.destroy({ orderCode, goodsCode });
        return ctx.helper.responseError({ message: '该商品已下架' });
      }
      // 校验商品库存
      if (orderGoods.goodsInventory < buyCount) {
        return ctx.helper.responseError({ message: '该商品库存不足' });
      }
      await ctx.service.ordersGoodsRelations.update({ buyCount }, { orderCode, goodsCode });

      return ctx.helper.responseSuccess({ data: true });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }
}

module.exports = OrdersController;
