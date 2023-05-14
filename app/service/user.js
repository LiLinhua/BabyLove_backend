'use strict';
const Service = require('egg').Service;
const { v4: uuidv4 } = require('uuid');

class UserService extends Service {
  login() {
    this.ctx.cookies.set(this.config.login.cookieName, uuidv4(), { signed: true, encrypt: true });
  }
  logout() {
    this.ctx.cookies.set(this.config.login.cookieName, '', { maxAge: 0 });
  }
  checkIsLogin() {
    return this.ctx.cookies.get(this.config.login.cookieName, { signed: true, encrypt: true });
  }
  checkIsAdmin(username, password) {
    const { hy } = this.config;
    return hy.username === username && hy.password === password;
  }
}

module.exports = UserService;
