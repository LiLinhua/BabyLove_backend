const Service = require('egg').Service;

class BaseService extends Service {
  constructor(props) {
    super(props);
    this.model = this.app.model[props.modelName];
  }
  async query(api, options = {}) {
    return await this.model[api](options);
  }
  async findOne(where = {}, options = {}) {
    return await this.query('findOne', { where, ...options });
  }
  async findAll(where = {}, options = {}) {
    return await this.query('findAll', { where, ...options });
  }
  async create(data, options = {}) {
    return await this.model.create(data, options);
  }
  async bulkCreate(datas, options = {}) {
    return await this.model.bulkCreate(datas, options);
  }
  async update(data, where = {}, options = {}) {
    return await this.model.update(data, { where, ...options });
  }
  async destroy(where = {}, options = {}) {
    return await this.model.destroy({ where, ...options });
  }
}

module.exports = BaseService;
