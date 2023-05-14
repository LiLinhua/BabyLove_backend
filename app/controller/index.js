'use strict';

const { Controller } = require('egg');

class IndexController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html', { test: 'test', obj: JSON.stringify({ a: 1 }) });
  }
}

module.exports = IndexController;
