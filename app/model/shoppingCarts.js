'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const ShoppingCarts = app.model.define('shopping_carts', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    shoppingCartCode: { field: 'shopping_cart_code', type: STRING(50), allowNull: false, comment: '购物车代码' },
    createdAt: { field: 'created_at', type: DATE, allowNull: false, comment: '创建时间' },
    updatedAt: { field: 'updated_at', type: DATE, allowNull: false, comment: '更新时间' },
    deletedAt: { field: 'deleted_at', type: DATE, allowNull: true, comment: '删除时间' },
  }, {
    timestamp: true,
  });

  return ShoppingCarts;
};
