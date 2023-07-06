'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Expresses = app.model.define('expresses', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    expressCode: { field: 'express_code', type: STRING(50), allowNull: false, comment: '物流编码' },
    expressNumber: { field: 'express_number', type: INTEGER, allowNull: false, comment: '快递单号' },
    createdAt: { field: 'created_at', type: DATE, allowNull: false, comment: '创建时间' },
    updatedAt: { field: 'updated_at', type: DATE, allowNull: false, comment: '更新时间' },
    deletedAt: { field: 'deleted_at', type: DATE, allowNull: true, comment: '删除时间' },
  }, {
    timestamp: true,
    paranoid: true,
  });

  return Expresses;
};
