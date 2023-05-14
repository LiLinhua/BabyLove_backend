'use strict';

const { Controller } = require('egg');

class GoodsController extends Controller {
  async queryAllGoods() {
    const { ctx, app } = this;

    try {
      const data = await ctx.service.goods.findAll({}, {
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
