'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, FLOAT } = app.Sequelize;

  const Orders = app.model.define('orders', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    orderCode: { field: 'order_code', type: STRING(50), allowNull: false, comment: '订单编码' },
    shoppingCartCode: { field: 'shopping_cart_code', type: STRING(50), allowNull: false, comment: '购物车编码' },
    totalCount: { field: 'total_count', type: INTEGER, allowNull: false, comment: '购买总数量' },
    totalPrice: { field: 'total_price', type: FLOAT, allowNull: false, comment: '订单总价格' },
    expressCode: { field: 'express_code', type: STRING(50), allowNull: true, comment: '物流编码' },
    status: { field: 'status', type: STRING(50), allowNull: false, comment: '订单状态，待付款（WAIT_PAY）、待发货（WAIT_SEND）、待收货（WAIT_GET）、已完成（FINISHED）和已取消（CANCELED）共5种状态' },
    createdAt: { field: 'created_at', type: DATE, allowNull: false, comment: '创建时间' },
    updatedAt: { field: 'updated_at', type: DATE, allowNull: false, comment: '更新时间' },
    deletedAt: { field: 'deleted_at', type: DATE, allowNull: true, comment: '删除时间' },
  }, {
    timestamp: true,
    paranoid: true,
  });

  Orders.associate = () => {
    const { Goods, Orders, OrdersGoodsRelations } = app.model;
    // 订单与商品多对多
    Orders.belongsToMany(Goods, { as: 'goods', through: OrdersGoodsRelations, foreignKey: 'orderCode', sourceKey: 'orderCode', otherKey: 'goodsCode' });
    Goods.belongsToMany(Orders, { as: 'order', through: OrdersGoodsRelations, foreignKey: 'goodsCode', sourceKey: 'goodsCode', otherKey: 'orderCode' });
  };

  return Orders;
};
