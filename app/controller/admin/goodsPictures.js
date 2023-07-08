'use strict';
const { Controller } = require('egg');

class GoodsPicturesController extends Controller {
  /**
   * 添加商品图片
   */
  async addGoodsPictures() {
    const { ctx } = this;
    const { files } = ctx.request;

    // 参数校验
    if (!Array.isArray(files) || !files.length) {
      return ctx.helper.responseError({ message: '图片不能为空' });
    }

    try {
      const goodsPictures = [];
      // 上传图片到 public 目录
      files.forEach(file => {
        const { success, fileCode, filePath, fileName } = ctx.service.upload.uploadPicture(file, 'goods');
        if (!success) {
          throw '图片上传失败';
        }
        goodsPictures.push({ pictureCode: fileCode, pictureUrl: filePath, fileName });
      });

      // 创建商品图片
      await ctx.service.goodsPictures.bulkCreate(goodsPictures);

      // 响应前端
      return ctx.helper.responseSuccess({ data: goodsPictures });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }
}

module.exports = GoodsPicturesController;
