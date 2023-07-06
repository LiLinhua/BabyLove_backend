'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router.get('/', controller.index.index);
  router.get(/^(?=\/view\/)/, controller.index.index);

  // 登录
  router.post('/user/login', controller.admin.user.login);
  router.get('/user/logout', controller.admin.user.logout);

  // 管理后台
  router.post('/admin/goods/addGoods', controller.admin.goods.addGoods);
  router.post('/admin/goods/updateGoods', controller.admin.goods.updateGoods);
  router.get('/admin/goods/queryAllGoods', controller.admin.goods.queryAllGoods);
  router.get('/admin/goods/queryGoodsDetails', controller.admin.goods.queryGoodsDetails);
  router.post('/admin/goods/removeGoods', controller.admin.goods.removeGoods);
  router.get('/admin/shoppingCarts/queryAllShoppingCarts', controller.admin.shoppingCarts.queryAllShoppingCarts);
  router.post('/admin/shoppingCarts/addShoppingCart', controller.admin.shoppingCarts.addShoppingCart);
  router.post('/admin/shoppingCarts/addGoods', controller.admin.shoppingCarts.addGoods);
  router.get('/admin/shoppingCarts/queryAllGoods', controller.admin.shoppingCarts.queryAllGoods);
  router.post('/admin/shoppingCarts/batchRemoveGoods', controller.admin.shoppingCarts.batchRemoveGoods);
  router.post('/admin/shoppingCarts/batchUpdateSelected', controller.admin.shoppingCarts.batchUpdateSelected);
  router.post('/admin/shoppingCarts/updateBuyCount', controller.admin.shoppingCarts.updateBuyCount);
  router.get('/admin/shoppingCarts/queryAllGoodsCount', controller.admin.shoppingCarts.queryAllGoodsCount);
  router.post('/admin/goodsPictures/addGoodsPictures', controller.admin.goodsPictures.addGoodsPictures);
  router.post('/admin/orders/queryAllOrders', controller.admin.orders.queryAllOrders);
  router.post('/admin/orders/addOrder', controller.admin.orders.addOrder);


  // 客户侧
  router.get('/custom/goods/queryAllGoods', controller.custom.goods.queryAllGoods);
  router.get('/custom/goods/queryGoodsDetails', controller.custom.goods.queryGoodsDetails);
  router.post('/custom/shoppingCarts/addGoods', controller.custom.shoppingCarts.addGoods);
  router.post('/custom/shoppingCarts/updateBuyCount', controller.custom.shoppingCarts.updateBuyCount);
  router.get('/custom/shoppingCarts/queryAllGoods', controller.custom.shoppingCarts.queryAllGoods);
  router.post('/custom/shoppingCarts/batchRemoveGoods', controller.custom.shoppingCarts.batchRemoveGoods);
  router.post('/custom/shoppingCarts/addShoppingCart', controller.custom.shoppingCarts.addShoppingCart);
  router.post('/custom/shoppingCarts/batchUpdateSelected', controller.custom.shoppingCarts.batchUpdateSelected);
  router.get('/custom/shoppingCarts/queryAllGoodsCount', controller.custom.shoppingCarts.queryAllGoodsCount);
};
