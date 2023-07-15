const BaseService = require('./base');

class CatalogsService extends BaseService {
  constructor(props = {}) {
    super({ ...props, modelName: 'GoodsCatalogs' });
  }
}

module.exports = CatalogsService;
