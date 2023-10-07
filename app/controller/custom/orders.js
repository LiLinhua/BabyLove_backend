'use strict';
const { Controller } = require('egg');

class OrdersController extends Controller {
  /**
   * 查询所有订单
   */
  async queryAllOrders() {
    const { ctx, app } = this;
    const { Op } = ctx.model.Sequelize;
    let { shoppingCartCode, keyword } = ctx.request.body;

    if (!shoppingCartCode) {
      return ctx.helper.responseError({ message: '购物车编码不能为空' });
    }
    if (keyword && typeof keyword === 'string') {
      keyword = keyword.trim();
    } else {
      keyword = '';
    }

    try {
      // 查询购物车与商品信息
      const orders = await ctx.service.orders.findAll({}, {
        // attributes: [ 'orderCode', 'shoppingCartCode', 'totalCount', 'totalPrice', 'expressWay', 'expressCode', 'status', 'createdAt' ],
        order: [[ 'updatedAt', 'desc' ]],
        where: {
          shoppingCartCode,
          [Op.or]: [
            { orderCode: { [Op.like]: '%' + keyword + '%' } },
            { shoppingCartCode: { [Op.like]: '%' + keyword + '%' } },
            { expressCode: { [Op.like]: '%' + keyword + '%' } },
          ],
        },
        include: [{
          model: app.model.Goods,
          as: 'goods',
          attributes: [ 'goodsCode', 'goodsStatus', 'goodsTitle', 'goodsPrice', 'goodsOriginPrice' ],
          // where: {
          //   [Op.or]: [
          //     { goodsCode: { [Op.like]: '%' + keyword + '%' } },
          //     { goodsTitle: { [Op.like]: '%' + keyword + '%' } },
          //   ],
          // },
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

      // 待付款的订单，需要检查商品价格是否有变动，下单时要以商品当前价格下单
      const isPriceChangeMap = {};
      const needUpdateOrderCodes = [];
      const needUpdateOrders = [];
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        if (order.status !== ctx.service.orders.status.WAIT_PAY) {
          continue;
        }
        let totalPrice = 0;
        for (let j = 0; j < order.goods.length; j++) {
          totalPrice += order.goods[j].goodsPrice * order.goods[j].ordersGoodsRelations.buyCount;
          if (order.goods[j].goodsPrice !== order.goods[j].ordersGoodsRelations.goodsPrice) {
            isPriceChangeMap[order.orderCode] = true;
          }
          if (j === order.goods.length - 1 && isPriceChangeMap[order.orderCode] && needUpdateOrderCodes.indexOf(order.orderCode) < 0 && order.totalPrice !== totalPrice) {
            order.totalPrice = totalPrice;
            needUpdateOrders.push(order.toJSON());
            needUpdateOrderCodes.push(order.orderCode);
          }
        }
      }

      // 待付款的订单，价格变动时，重新更新订单总价
      if (needUpdateOrders.length > 0) {
        await ctx.service.orders.bulkCreate(needUpdateOrders, { updateOnDuplicate: [ 'totalPrice' ] });
      }

      return ctx.helper.responseSuccess({ data: orders });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 校验订单
   */
  async checkOrder() {
    const { ctx, app } = this;
    const { shoppingCartCode } = ctx.request.body;

    if (!shoppingCartCode) {
      return ctx.helper.responseError({ message: '购物车编码不能为空' });
    }

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
          attributes: [ 'goodsCode', 'goodsStatus', 'goodsPrice', 'goodsTitle', 'goodsInventory' ],
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
      for (let i = 0; i < shoppingCart.goods.length; i++) {
        const { goodsInventory, goodsTitle, goodsStatus, goodsShoppingCartsRelations } = shoppingCart.goods[i];
        if (goodsInventory < 1 || goodsInventory < goodsShoppingCartsRelations.buyCount) {
          return ctx.helper.responseError({ message: `您选购的商品“${goodsTitle}”库存不足` });
        }
        if (goodsStatus !== ctx.service.goods.status.NORMAL) {
          return ctx.helper.responseError({ message: `您选购的商品“${goodsTitle}”已下架` });
        }
      }

      return ctx.helper.responseSuccess({ data: true });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 查询订单详情
   */
  async queryOrderDetails() {
    const { ctx, app } = this;
    const { orderCode, shoppingCartCode } = ctx.request.body;

    if (!orderCode) {
      return ctx.helper.responseError({ message: '订单编码不能为空' });
    }

    try {
      // 查询购物车与商品信息
      const order = await ctx.service.orders.findOne({ orderCode, shoppingCartCode }, {
        // attributes: ['orderCode', 'shoppingCartCode', 'totalCount', 'totalPrice', 'expressWay', 'expressCode', 'status', 'createdAt'],
        include: [{
          model: app.model.Goods,
          as: 'goods',
          attributes: [ 'goodsCode', 'goodsStatus', 'goodsTitle', 'goodsPrice', 'goodsOriginPrice' ],
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

      // 待付款的订单，需要检查商品价格是否有变动，下单时要以商品当前价格下单
      if (order.status === ctx.service.orders.status.WAIT_PAY) {
        let isPriceChange = false;
        let totalPrice = 0;
        for (let i = 0; i < order.goods.length; i++) {
          if (order.goods[i].goodsPrice !== order.goods[i].ordersGoodsRelations.goodsPrice) {
            isPriceChange = true;
          }
          totalPrice += order.goods[i].goodsPrice * order.goods[i].ordersGoodsRelations.buyCount;
        }
        // 价格变动时，重新更新订单总价
        if (isPriceChange) {
          await ctx.service.orders.update({ totalPrice }, { orderCode: order.orderCode });
          order.totalPrice = totalPrice;
        }
      }

      return ctx.helper.responseSuccess({ data: order });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 取消订单
   */
  async cancelOrder() {
    const { ctx } = this;
    const { orderCode, shoppingCartCode } = ctx.request.body;

    // 检查参数
    if (!orderCode || !shoppingCartCode) {
      return ctx.helper.responseError({ message: '参数错误，请刷新页面重试' });
    }


    try {
      // 查询订单信息
      const order = await ctx.service.orders.findOne({ orderCode }, { attributes: [ 'status' ] });

      // 校验订单是否存在
      if (!order) {
        return ctx.helper.responseError({ message: '订单不存在，请刷新页面再试' });
      }
      const { CANCELED, WAIT_PAY } = ctx.service.orders.status;
      if (order.status === CANCELED) {
        return ctx.helper.responseError({ message: '订单已取消' });
      }
      if (order.status !== WAIT_PAY) {
        return ctx.helper.responseError({ message: '订单已支付，请联系平台客服处理' });
      }

      // 更新订单基础信息
      await ctx.service.orders.update({ status: CANCELED }, { orderCode, shoppingCartCode });

      return ctx.helper.responseSuccess({ data: true });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }
}

module.exports = OrdersController;
