'use strict';

module.exports = options => {
  return async function adminLogin(ctx, next) {
    if (!ctx.service.users.checkIsLogin(ctx)) {
      return ctx.helper.responseError({ code: 0, message: '请登录' });
    }
    if (!ctx.service.users.checkIsAdmin(ctx)) {
      return ctx.helper.responseError({ code: 0, message: '暂无权限' });
    }
    await next();
  };
};
