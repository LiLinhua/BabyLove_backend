'use strict';
const { Controller } = require('egg');

class GoodsController extends Controller {
  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;

    if (!ctx.service.user.checkIsAdmin(username, password)) {
      return ctx.helper.responseError({ message: '账号或者密码错误' });
    }

    try {
      ctx.service.user.login();
      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  async logout() {
    const { ctx } = this;

    try {
      ctx.service.user.logout();
      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }
}

module.exports = GoodsController;
