const BaseService = require('./base');

class GoodsPicturesService extends BaseService {
  constructor(props = {}) {
    super({ ...props, modelName: 'GoodsPictures' });
  }
}

module.exports = GoodsPicturesService;
