const BaseService = require('./base');

class GoodsPicturesRelationsService extends BaseService {
  constructor(props = {}) {
    super({ ...props, modelName: 'GoodsPicturesRelations' });
  }
}

module.exports = GoodsPicturesRelationsService;
