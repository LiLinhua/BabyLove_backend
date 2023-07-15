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

  async createCatalog() {
    const { ctx } = this;
    const { catalogCode, catalogName } = ctx.request.body;
    if (!catalogCode) {
      return ctx.helper.responseError({ message: '分类编码不能为空' });
    }
    if (!catalogName) {
      return ctx.helper.responseError({ message: '分类名称不能为空' });
    }

    try {
      const catalog = await ctx.service.catalogs.findOne({ catalogCode });
      if (catalog) {
        return ctx.helper.responseError({ message: '分类编码已经存在' });
      }
      await ctx.service.catalogs.create({ catalogCode, catalogName });
      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  async updateCatalog() {
    const { ctx } = this;
    const { catalogCode, catalogName } = ctx.request.body;
    if (!catalogCode) {
      return ctx.helper.responseError({ message: '分类编码不能为空' });
    }
    if (!catalogName) {
      return ctx.helper.responseError({ message: '分类名称不能为空' });
    }

    try {
      const catalog = await ctx.service.catalogs.findOne({ catalogCode });
      if (!catalog) {
        return ctx.helper.responseError({ message: '分类不存在' });
      }
      await ctx.service.catalogs.update({ catalogName }, { catalogCode });
      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  async removeCatalog() {
    const { ctx } = this;
    const { catalogCode } = ctx.request.body;
    if (!catalogCode) {
      return ctx.helper.responseError({ message: '分类编码不能为空' });
    }

    try {
      const catalog = await ctx.service.catalogs.findOne({ catalogCode });
      if (!catalog) {
        return ctx.helper.responseError({ message: '分类不存在' });
      }

      await ctx.service.catalogs.destroy({ catalogCode });
      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }
}

module.exports = CatalogsController;
