'use strict';
const { v4: uuidv4 } = require('uuid');
const { Controller } = require('egg');

class ShoppingCartsController extends Controller {
  async addGoods() {
    const { ctx } = this;
    const { shoppingCartCode, goodsCode, buyCount } = ctx.request.body;

    if (!goodsCode) {
      return ctx.helper.responseError({ message: '商品编码不能为空' });
    }
    if (isNaN(buyCount) || buyCount < 1) {
      return ctx.helper.responseError({ message: '商品数量不能小于1' });
    }
    if (!shoppingCartCode) {
      return ctx.helper.responseError({ message: '商品编码不能为空' });
    }

    try {
      const shoppingCart = await ctx.service.shoppingCarts.findOne({ shoppingCartCode });
      if (!shoppingCart) {
        return ctx.helper.responseError({ message: '购物车不存在或者已经被删除' });
      }

      const goods = await ctx.service.goods.findOne({ goodsCode });
      if (!goods) {
        return ctx.helper.responseError({ message: '商品不存在或者已经被删除' });
      }

      const relation = await ctx.service.goodsShoppingCartsRelations.findOne({ shoppingCartCode: shoppingCart.shoppingCartCode, goodsCode });
      if (relation) {
        await ctx.service.goodsShoppingCartsRelations.update({ buyCount: relation.buyCount + buyCount }, { shoppingCartCode: shoppingCart.shoppingCartCode, goodsCode });
      } else {
        await ctx.service.goodsShoppingCartsRelations.create({ shoppingCartCode: shoppingCart.shoppingCartCode, goodsCode, buyCount });
      }

      return ctx.helper.responseSuccess({ data: { shoppingCartCode: shoppingCart.shoppingCartCode } });
    } catch (error) {
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
      if (goods.goodsInventory < buyCount) {
        return ctx.helper.responseError({ message: '该商品库存不足' });
      }
      // 更新购买数量
      await ctx.service.goodsShoppingCartsRelations.update({ buyCount }, { shoppingCartCode, goodsCode });
      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  async addShoppingCart() {
    const { ctx } = this;

    try {
      const shoppingCart = await ctx.service.shoppingCarts.create({ shoppingCartCode: uuidv4() });
      return ctx.helper.responseSuccess({ data: shoppingCart });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  async queryAllGoods() {
    const { ctx, app } = this;
    const { shoppingCartCode } = ctx.request.body;

    if (!shoppingCartCode) {
      return ctx.helper.responseError({ message: '购物车编码不能为空' });
    }

    try {
      const shoppingCart = await ctx.service.shoppingCarts.findOne({ shoppingCartCode });
      if (!shoppingCart) {
        return ctx.helper.responseError({ message: '购物车不存在或者已经被删除' });
      }

      const data = await ctx.service.shoppingCarts.findOne({ shoppingCartCode }, {
        attributes: [ 'shoppingCartCode' ],
        include: [{
          model: app.model.Goods,
          as: 'goods',
          attributes: {
            exclude: [ 'deletedAt' ],
          },
          through: {
            attributes: [],
          },
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
      return ctx.helper.responseSuccess({ data });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  async queryAllGoodsCount() {
    const { ctx } = this;
    const { shoppingCartCode } = ctx.query;

    if (!shoppingCartCode) {
      return ctx.helper.responseError({ message: '购物车编码不能为空' });
    }

    try {
      const data = await ctx.service.goodsShoppingCartsRelations.findAll({ shoppingCartCode }, {
        attributes: [ 'goodsCode' ],
      });

      return ctx.helper.responseSuccess({ data: data ? data.length : 0 });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  async removeGoods() {
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

module.exports = ShoppingCartsController;
