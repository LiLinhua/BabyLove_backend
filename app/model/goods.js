'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT, FLOAT } = app.Sequelize;

  const Goods = app.model.define('goods', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    goodsCode: { field: 'goods_code', type: STRING(50), allowNull: false, comment: '商品代码' },
    goodsTitle: { field: 'goods_title', type: STRING(500), allowNull: false, comment: '商品标题' },
    goodsSubtitle: { field: 'goods_subtitle', type: STRING(500), allowNull: true, comment: '商品副标题' },
    goodsDetails: { field: 'goods_details', type: TEXT, allowNull: true, comment: '商品详情' },
    goodsPrice: { field: 'goods_price', type: FLOAT, allowNull: false, comment: '商品价格' },
    goodsCatalog: { field: 'goods_catalog', type: STRING(50), allowNull: false, comment: '商品目录' },
    goodsInventory: { field: 'goods_inventory', type: INTEGER, allowNull: false, comment: '商品库存' },
    createdAt: { field: 'created_at', type: DATE, allowNull: false, comment: '创建时间' },
    updatedAt: { field: 'updated_at', type: DATE, allowNull: false, comment: '更新时间' },
    deletedAt: { field: 'deleted_at', type: DATE, allowNull: true, comment: '删除时间' },
  }, {
    timestamp: true,
  });

  Goods.associate = () => {
    const { Goods, GoodsPictures, GoodsPicturesRelations, ShoppingCarts, GoodsShoppingCartsRelations } = app.model;

    // 商品与商品图片多对多
    Goods.belongsToMany(GoodsPictures, { as: 'pictures', through: GoodsPicturesRelations, foreignKey: 'goodsCode', sourceKey: 'goodsCode', otherKey: 'pictureCode' });
    GoodsPictures.belongsToMany(Goods, { as: 'goods', through: GoodsPicturesRelations, foreignKey: 'pictureCode', sourceKey: 'pictureCode', otherKey: 'goodsCode' });

    // 购物车与商品多对多
    ShoppingCarts.belongsToMany(Goods, { as: 'goods', through: GoodsShoppingCartsRelations, foreignKey: 'shoppingCartCode', sourceKey: 'shoppingCartCode', otherKey: 'goodsCode' });
    Goods.belongsToMany(ShoppingCarts, { as: 'shoppingCarts', through: GoodsShoppingCartsRelations, foreignKey: 'goodsCode', sourceKey: 'goodsCode', otherKey: 'shoppingCartCode' });
  };

  return Goods;
};
