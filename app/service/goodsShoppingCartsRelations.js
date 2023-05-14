const BaseService = require('./base');

class GoodsShoppingCartsRelationsService extends BaseService {
  constructor(props = {}) {
    super({ ...props, modelName: 'GoodsShoppingCartsRelations' });
  }
}

module.exports = GoodsShoppingCartsRelationsService;
