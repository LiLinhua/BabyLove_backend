const BaseService = require('./base');

class ShoppingCartsService extends BaseService {
  constructor(props = {}) {
    super({ ...props, modelName: 'ShoppingCarts' });
  }
}

module.exports = ShoppingCartsService;
