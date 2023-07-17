'use strict';
const { Controller } = require('egg');

class CatalogsController extends Controller {
  async queryCatalogList() {
    const { ctx } = this;
    const { Op } = ctx.model.Sequelize;
    let { keyword } = ctx.request.body;
    if (keyword && typeof keyword === 'string') {
      keyword = keyword.trim();
    } else {
      keyword = '';
    }

    try {
      const catalogs = await ctx.service.catalogs.findAll({
        [Op.or]: [
          { catalogCode: { [Op.like]: '%' + keyword + '%' } },
          { catalogName: { [Op.like]: '%' + keyword + '%' } },
        ],
      });
      return ctx.helper.responseSuccess({ data: catalogs });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }
}

module.exports = CatalogsController;
