'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

  const GoodsPictures = app.model.define('goodsPictures', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    pictureCode: { field: 'picture_code', type: STRING(50), allowNull: false, comment: '图片代码' },
    pictureUrl: { field: 'picture_url', type: TEXT, allowNull: false, comment: '图片地址' },
    pictureContent: { field: 'picture_content', type: TEXT, allowNull: true, comment: '图片内容' },
    createdAt: { field: 'created_at', type: DATE, allowNull: false, comment: '创建时间' },
    updatedAt: { field: 'updated_at', type: DATE, allowNull: false, comment: '更新时间' },
    deletedAt: { field: 'deleted_at', type: DATE, allowNull: true, comment: '删除时间' },
  }, {
    timestamp: true,
    paranoid: true,
  });

  return GoodsPictures;
};
