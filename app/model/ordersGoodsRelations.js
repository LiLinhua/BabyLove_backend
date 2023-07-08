'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, FLOAT } = app.Sequelize;

  const OrdersGoodsRelations = app.model.define('ordersGoodsRelations', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    orderCode: { field: 'order_code', type: STRING(50), allowNull: false, comment: '订单编码' },
    goodsCode: { field: 'goods_code', type: STRING(50), allowNull: false, comment: '商品编码' },
    shoppingCartCode: { field: 'shopping_cart_code', type: STRING(50), allowNull: false, comment: '购物车编码' },
    buyCount: { field: 'buy_count', type: INTEGER, allowNull: false, comment: '购买数量' },
    goodsPrice: { field: 'goods_price', type: FLOAT, allowNull: false, comment: '商品价格' },
    createdAt: { field: 'created_at', type: DATE, allowNull: false, comment: '创建时间' },
    updatedAt: { field: 'updated_at', type: DATE, allowNull: false, comment: '更新时间' },
    deletedAt: { field: 'deleted_at', type: DATE, allowNull: true, comment: '删除时间' },
  }, {
    timestamp: true,
    paranoid: true,
  });

  return OrdersGoodsRelations;
};
