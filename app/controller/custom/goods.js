'use strict';

const { Controller } = require('egg');

class GoodsController extends Controller {
  async queryAllGoods() {
    const { ctx, app } = this;
    const { Op } = ctx.model.Sequelize;
    let { keyword, goodsCatalog } = ctx.request.query;
    if (keyword && typeof keyword === 'string') {
      keyword = keyword.trim();
    } else {
      keyword = '';
    }

    try {
      const where = {
        goodsStatus: ctx.service.goods.status.NORMAL,
        [Op.or]: [
          { goodsCode: { [Op.like]: '%' + keyword + '%' } },
          { goodsTitle: { [Op.like]: '%' + keyword + '%' } },
          { goodsSubtitle: { [Op.like]: '%' + keyword + '%' } },
        ],
      };
      if (goodsCatalog && typeof goodsCatalog === 'string') {
        where.goodsCatalog = goodsCatalog.split(',');
      }
      const data = await ctx.service.goods.findAll(where, {
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

}

module.exports = GoodsController;
