const BaseService = require('./base');

class GoodsService extends BaseService {
  constructor(props = {}) {
    super({ ...props, modelName: 'Goods' });
  }
}

module.exports = GoodsService;
