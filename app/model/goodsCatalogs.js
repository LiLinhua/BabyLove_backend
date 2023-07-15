'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const GoodsCatalog = app.model.define('goodsCatalog', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    catalogCode: { field: 'catalog_code', type: STRING(50), allowNull: false, comment: '分类编码代码' },
    catalogName: { field: 'catalog_name', type: STRING(255), allowNull: false, comment: '分类名' },
    createdAt: { field: 'created_at', type: DATE, allowNull: false, comment: '创建时间' },
    updatedAt: { field: 'updated_at', type: DATE, allowNull: false, comment: '更新时间' },
    deletedAt: { field: 'deleted_at', type: DATE, allowNull: true, comment: '删除时间' },
  }, {
    timestamp: true,
    paranoid: true,
  });

  return GoodsCatalog;
};
