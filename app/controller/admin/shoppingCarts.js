'use strict';
const { v4: uuidv4 } = require('uuid');
const { Controller } = require('egg');

class ShoppingCartsController extends Controller {
  async queryAllShoppingCarts() {
    const { ctx, app } = this;

    try {
      // 查询购物车与商品信息
      const shoppingCarts = await ctx.service.shoppingCarts.findAll({}, {
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

      // 获取购物车编码
      let shoppingCartCodes = [];
      if (Array.isArray(shoppingCarts)) {
        shoppingCartCodes = shoppingCarts.map(shoppingCart => {
          return shoppingCart.shoppingCartCode;
        });
      }

      // 查询购物车与商品关系
      const relations = await ctx.service.goodsShoppingCartsRelations.findAll({ shoppingCartCode: shoppingCartCodes });
      const relationsMap = {};
      relations.forEach(relation => {
        relationsMap[`${relation.shoppingCartCode}&${relation.goodsCode}`] = relation;
      });

      // 补充购物车商品的购买数量与是否选择字段
      let newShoppingCarts = [];
      if (Array.isArray(shoppingCarts)) {
        newShoppingCarts = shoppingCarts.map(shoppingCart => {
          shoppingCart = shoppingCart.toJSON();
          let goods = shoppingCart.goods;
          if (Array.isArray(goods)) {
            goods = goods.map(good => {
              if (relationsMap[`${shoppingCart.shoppingCartCode}&${good.goodsCode}`]) {
                good.buyCount = relationsMap[`${shoppingCart.shoppingCartCode}&${good.goodsCode}`].buyCount || 1;
                good.selected = relationsMap[`${shoppingCart.shoppingCartCode}&${good.goodsCode}`].selected || false;
              }
              return good;
            });
          }
          shoppingCart.goods = goods;
          return shoppingCart;
        });
      }
      return ctx.helper.responseSuccess({ data: newShoppingCarts });
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
        await ctx.service.goodsShoppingCartsRelations.create({ shoppingCartCode: shoppingCart.shoppingCartCode, goodsCode, buyCount, selected: 0 });
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

  async batchUpdateSelected() {
    const { ctx } = this;
    const { shoppingCartCode, goodsCodes, selected } = ctx.request.body;

    if (!shoppingCartCode) {
      return ctx.helper.responseError({ message: '购物车编码不能为空' });
    }
    if (!Array.isArray(goodsCodes)) {
      return ctx.helper.responseError({ message: '商品编码参数错误' });
    }
    if (![ 0, 1 ].includes(selected)) {
      return ctx.helper.responseError({ message: '选择状态不合法' });
    }

    try {
      // 查询关联记录
      const where = { shoppingCartCode };
      if (goodsCodes.length) {
        where.goodsCode = goodsCodes;
      }
      const relations = await ctx.service.goodsShoppingCartsRelations.findAll(where, { raw: true });
      // 更新购买选择状态
      const newRelations = relations.map(relation => ({ ...relation, selected }));
      await ctx.service.goodsShoppingCartsRelations.bulkCreate(newRelations, { updateOnDuplicate: [ 'selected' ] });

      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  async queryAllGoods() {
    const { ctx, app } = this;
    const { shoppingCartCode } = ctx.query;

    if (!shoppingCartCode) {
      return ctx.helper.responseError({ message: '购物车编码不能为空' });
    }

    try {
      let shoppingCart = await ctx.service.shoppingCarts.findOne({ shoppingCartCode }, {
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

      if (!shoppingCart) {
        return ctx.helper.responseError({ message: '购物车不存在或者已经被删除' });
      }

      // 查询购物车与商品关系
      const relations = await ctx.service.goodsShoppingCartsRelations.findAll({ shoppingCartCode }, { raw: true });
      const relationsMap = {};
      relations && relations.forEach(relation => {
        relationsMap[relation.goodsCode] = relation;
      });

      // 补充购物车商品的购买数量与是否选择字段
      shoppingCart = shoppingCart.toJSON();
      let goods = shoppingCart.goods;
      if (Array.isArray(goods)) {
        goods = goods.map(good => {
          if (relationsMap[good.goodsCode]) {
            good.buyCount = relationsMap[good.goodsCode].buyCount || 1;
            good.selected = relationsMap[good.goodsCode].selected || false;
          }
          return good;
        });
      }
      shoppingCart.goods = goods;

      return ctx.helper.responseSuccess({ data: shoppingCart });
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

module.exports = ShoppingCartsController;
