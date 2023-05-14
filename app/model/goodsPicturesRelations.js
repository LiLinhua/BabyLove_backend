'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const GoodsPicturesRelations = app.model.define('goods_pictures_relations', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    goodsCode: { field: 'goods_code', type: STRING(50), allowNull: false, comment: '商品代码' },
    pictureCode: { field: 'picture_code', type: STRING(50), allowNull: false, comment: '图片代码' },
    createdAt: { field: 'created_at', type: DATE, allowNull: false, comment: '创建时间' },
    updatedAt: { field: 'updated_at', type: DATE, allowNull: false, comment: '更新时间' },
    deletedAt: { field: 'deleted_at', type: DATE, allowNull: true, comment: '删除时间' },
  }, {
    timestamp: true,
  });

  return GoodsPicturesRelations;
};
