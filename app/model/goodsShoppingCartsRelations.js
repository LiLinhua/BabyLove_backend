'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const GoodsShoppingCartsRelations = app.model.define('goodsShoppingCartsRelations', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    goodsCode: { field: 'goods_code', type: STRING(50), allowNull: false, comment: '商品代码' },
    shoppingCartCode: { field: 'shopping_cart_code', type: STRING(50), allowNull: false, comment: '购物车代码' },
    buyCount: { field: 'buy_count', type: INTEGER, allowNull: false, comment: '购买数量' },
    selected: { field: 'selected', type: INTEGER, allowNull: false, comment: '是否选择' },
    createdAt: { field: 'created_at', type: DATE, allowNull: false, comment: '创建时间' },
    updatedAt: { field: 'updated_at', type: DATE, allowNull: false, comment: '更新时间' },
    deletedAt: { field: 'deleted_at', type: DATE, allowNull: true, comment: '删除时间' },
  }, {
    timestamp: true,
    paranoid: true,
  });

  return GoodsShoppingCartsRelations;
};
