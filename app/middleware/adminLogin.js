'use strict';

module.exports = options => {
  return async function adminLogin(ctx, next) {
    if (!ctx.service.user.checkIsLogin()) {
      return ctx.helper.responseError({ code: 0, message: '请登录' });
    }
    await next();
  };
};
