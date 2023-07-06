const BaseService = require('./base');

class OrdersGoodsRelationsService extends BaseService {
  constructor(props = {}) {
    super({ ...props, modelName: 'OrdersGoodsRelations' });
  }
}

module.exports = OrdersGoodsRelationsService;
