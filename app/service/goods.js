const BaseService = require('./base');

class GoodsService extends BaseService {
  constructor(props = {}) {
    super({ ...props, modelName: 'Goods' });
  }

  /**
   * 商品状态
   */
  get status() {
    return {
      NORMAL: 'NORMAL', // 正常
      OFFLINE: 'OFFLINE', // 已下架
    };
  }
}

module.exports = GoodsService;
