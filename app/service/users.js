'use strict';
const BaseService = require('./base');

class UserService extends BaseService {
  constructor(props = {}) {
    super({ ...props, modelName: 'Users' });
  }
  login(ctx, user) {
    ctx.cookies.set(this.config.login.cookieName, user.userCode, { signed: true, encrypt: true });
    ctx.session.user = user;
  }
  logout(ctx) {
    ctx.cookies.set(this.config.login.cookieName, '', { maxAge: 0 });
    ctx.session.user = null;
  }
  checkIsLogin(ctx) {
    return ctx.cookies.get(this.config.login.cookieName, { signed: true, encrypt: true }) && ctx.session.user;
  }
  checkIsAdmin(ctx) {
    return ctx.session.user && ctx.session.user.isAdmin;
  }
}

module.exports = UserService;
