'use strict';
const { v4: uuidv4 } = require('uuid');
const { Controller } = require('egg');
const goodsCatalogEnum = require('../../constants/goods');

class GoodsController extends Controller {
  /**
   * 添加商品
   */
  async addGoods() {
    const { ctx } = this;
    const { goodsTitle, goodsSubtitle, goodsDetails, goodsPrice, goodsInventory, goodsPictureCodes } = ctx.request.body;

    // 参数校验
    if (!goodsTitle) {
      return ctx.helper.responseError({ message: '商品标题不能为空' });
    }
    if (!goodsPrice) {
      return ctx.helper.responseError({ message: '商品价格不能为空' });
    }
    if (isNaN(goodsPrice) || goodsPrice < 0) {
      return ctx.helper.responseError({ message: '商品价格不合法' });
    }
    if (!goodsInventory) {
      return ctx.helper.responseError({ message: '商品库存不能为空' });
    }
    if (isNaN(goodsInventory) || goodsInventory < 0) {
      return ctx.helper.responseError({ message: '商品库存不合法' });
    }
    if (!Array.isArray(goodsPictureCodes) || !goodsPictureCodes.length) {
      return ctx.helper.responseError({ message: '商品图片不能为空' });
    }

    let transaction;
    try {
      // 启动事务
      transaction = await ctx.model.transaction();

      // 创建商品
      const result = await ctx.service.goods.create({ goodsCode: uuidv4(), goodsTitle, goodsSubtitle, goodsDetails, goodsPrice, goodsInventory, goodsCatalog: goodsCatalogEnum.CHILDREN_CLOTHING }, { transaction });

      // 创建商品图片
      const goodsPictures = goodsPictureCodes.map(code => {
        return { pictureCode: code, goodsCode: result.goodsCode };
      });
      await ctx.service.goodsPicturesRelations.bulkCreate(goodsPictures, { transaction });

      // 提交事务
      transaction.commit();

      // 响应前端
      return ctx.helper.responseSuccess({ data: result });
    } catch (error) {
      // 回滚事务
      transaction.rollback();
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 更新商品
   */
  async updateGoods() {
    const { ctx } = this;
    const { goodsCode, goodsTitle, goodsSubtitle, goodsDetails, goodsPrice, goodsCatalog, goodsInventory, goodsPictureCodes } = ctx.request.body;

    // 参数校验
    if (!goodsCode) {
      return ctx.helper.responseError({ message: '商品编码不能为空' });
    }
    if (!goodsTitle) {
      return ctx.helper.responseError({ message: '商品标题不能为空' });
    }
    if (!goodsCatalogEnum[goodsCatalog]) {
      return ctx.helper.responseError({ message: '商品目录不合法' });
    }
    if (!goodsPrice) {
      return ctx.helper.responseError({ message: '商品价格不能为空' });
    }
    if (isNaN(goodsPrice) || goodsPrice < 0) {
      return ctx.helper.responseError({ message: '商品价格不合法' });
    }
    if (!goodsInventory) {
      return ctx.helper.responseError({ message: '商品库存不能为空' });
    }
    if (isNaN(goodsInventory) || goodsInventory < 0) {
      return ctx.helper.responseError({ message: '商品库存不合法' });
    }
    if (!Array.isArray(goodsPictureCodes) || !goodsPictureCodes.length) {
      return ctx.helper.responseError({ message: '商品图片不能为空' });
    }

    let transaction;
    try {
      // 验证商品是否存在
      const goods = await ctx.service.goods.findOne({ goodsCode });
      if (!goods) {
        return ctx.helper.responseError({ message: '商品不存在或者已经被删除' });
      }

      // 启动事务
      transaction = await ctx.model.transaction();

      // 更新商品
      await ctx.service.goods.update({ goodsTitle, goodsSubtitle, goodsDetails, goodsPrice, goodsInventory, goodsCatalog }, { goodsCode }, { transaction });

      // 更新商品图片
      // 移除现有的商品图片
      await ctx.service.goodsPicturesRelations.destroy({ goodsCode }, { transaction });
      // 重新添加商品图片
      const goodsPictures = goodsPictureCodes.map(code => {
        return { pictureCode: code, goodsCode };
      });
      await ctx.service.goodsPicturesRelations.bulkCreate(goodsPictures, { transaction });

      // 提交事务
      transaction.commit();
      return ctx.helper.responseSuccess();
    } catch (error) {
      // 回滚事务
      transaction.rollback();
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 查询商品列表
   */
  async queryAllGoods() {
    const { ctx, app } = this;

    try {
      const data = await ctx.service.goods.findAll({}, {
        attributes: {
          exclude: [ 'deletedAt' ],
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
      });
      return ctx.helper.responseSuccess({ data });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 查询商品详情
   */
  async queryGoodsDetails() {
    const { ctx, app } = this;
    const { goodsCode } = ctx.query;
    if (!goodsCode) {
      return ctx.helper.responseError({ message: '商品编码不能为空' });
    }

    try {
      const data = await ctx.service.goods.findOne({ goodsCode }, {
        attributes: {
          exclude: [ 'deletedAt' ],
        },
        include: [{
          model: app.model.GoodsPictures,
          as: 'pictures',
          attributes: [ 'pictureCode', 'pictureUrl' ],
          through: {
            attributes: [],
          },
        }],
      });
      return ctx.helper.responseSuccess({ data });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 删除商品
   */
  async removeGoods() {
    const { ctx } = this;
    const { goodsCode } = ctx.request.body;

    if (!goodsCode) {
      return ctx.helper.responseError({ message: '商品编码不能为空' });
    }

    try {
      await ctx.service.goods.destroy({ goodsCode });
      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }
}

module.exports = GoodsController;
