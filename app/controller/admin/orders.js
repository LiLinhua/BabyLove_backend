'use strict';
const { v4: uuidv4 } = require('uuid');
const { Controller } = require('egg');

class OrdersController extends Controller {
  async queryAllOrders() {
    const { ctx, app } = this;
    const { Op } = ctx.model.Sequelize;
    let { keyword } = ctx.request.body;
    if (keyword && typeof keyword === 'string') {
      keyword = keyword.trim();
    }

    try {
      // 查询购物车与商品信息
      const orders = await ctx.service.orders.findAll({}, {
        attributes: [ 'orderCode', 'shoppingCartCode', 'totalCount', 'totalPrice', 'expressCode', 'status', 'createdAt' ],
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
    const { shoppingCartCode } = ctx.request.body;

    if (!shoppingCartCode) {
      return ctx.helper.responseError({ message: '购物车编码不能为空' });
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
        const { goodsInventory, goodsTitle, goodsPrice, goods_shopping_carts_relations } = shoppingCart.goods[i];
        if (goodsInventory < goods_shopping_carts_relations.buyCount) {
          return ctx.helper.responseError({ message: `您选购的商品“${goodsTitle}”库存不足` });
        }
        totalCount += goods_shopping_carts_relations.buyCount;
        totalPrice += goodsPrice;
      }

      // 启动事务
      transaction = await ctx.model.transaction();

      // 创建订单信息
      const orderCode = await ctx.service.orders.generateOrderCode();
      const orderInfo = {
        orderCode,
        shoppingCartCode,
        totalCount,
        totalPrice,
        status: ctx.service.orders.status.WAIT_PAY,
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
          buyCount: goods.goods_shopping_carts_relations.buyCount,
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

  async updateBuyCount() {
    const { ctx } = this;
    const { shoppingCartCode, goodsCode, buyCount } = ctx.request.body;

    if (!shoppingCartCode) {
      return ctx.helper.responseError({ message: '购物车编码不能为空' });
    }
    if (!goodsCode) {
      return ctx.helper.responseError({ message: '商品编码不能为空' });
    }
    if (isNaN(buyCount) || buyCount < 1) {
      return ctx.helper.responseError({ message: '购买数量不合法' });
    }

    try {
      // 查询商品库存
      const goods = await ctx.service.goods.findOne({ goodsCode });
      if (!goods) {
        return ctx.helper.responseError({ message: '商品不存在或者已经被删除' });
      }
      // 检查库存
      let newGoodsCount = buyCount;
      let isOutOfStock = false;
      if (goods.goodsInventory < buyCount) {
        newGoodsCount = goods.goodsInventory;
        isOutOfStock = true;
      }
      // 更新购买数量
      await ctx.service.goodsShoppingCartsRelations.update({ buyCount: newGoodsCount }, { shoppingCartCode, goodsCode });
      return ctx.helper.responseSuccess({ data: newGoodsCount, message: isOutOfStock ? '该商品库存不足' : '成功', errCode: isOutOfStock ? 'OUT_OF_STOCK' : undefined });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  async batchRemoveGoods() {
    const { ctx } = this;

    const { shoppingCartCode, goodsCodes } = ctx.request.body;

    if (!shoppingCartCode) {
      return ctx.helper.responseError({ message: '购物车编码不能为空' });
    }
    if (!Array.isArray(goodsCodes) || !goodsCodes.length) {
      return ctx.helper.responseError({ message: '商品编码不能为空' });
    }

    try {
      await ctx.service.goodsShoppingCartsRelations.destroy({ shoppingCartCode, goodsCode: goodsCodes });
      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

}

module.exports = OrdersController;
