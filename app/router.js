'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.index.index);

  // 登录
  router.post('/user/login', controller.admin.user.login);
  router.get('/user/logout', controller.admin.user.logout);

  // 管理后台
  router.post('/admin/goods/addGoods', controller.admin.goods.addGoods);
  router.post('/admin/goods/updateGoods', controller.admin.goods.updateGoods);
  router.get('/admin/goods/queryAllGoods', controller.admin.goods.queryAllGoods);
  router.get('/admin/shoppingCarts/queryAllShoppingCarts', controller.admin.shoppingCarts.queryAllShoppingCarts);
  router.post('/admin/shoppingCarts/addShoppingCart', controller.admin.shoppingCarts.addShoppingCart);
  router.post('/admin/shoppingCarts/addGoods', controller.admin.shoppingCarts.addGoods);
  router.get('/admin/shoppingCarts/queryAllGoods', controller.admin.shoppingCarts.queryAllGoods);
  router.post('/admin/shoppingCarts/removeGoods', controller.admin.shoppingCarts.removeGoods);
  router.post('/admin/goodsPictures/addGoodsPictures', controller.admin.goodsPictures.addGoodsPictures);


  // 客户侧
  router.get('/custom/goods/queryAllGoods', controller.custom.goods.queryAllGoods);
  router.post('/custom/shoppingCarts/addGoods', controller.custom.shoppingCarts.addGoods);
  router.get('/custom/shoppingCarts/queryAllGoods', controller.custom.shoppingCarts.queryAllGoods);
  router.post('/custom/shoppingCarts/removeGoods', controller.custom.shoppingCarts.removeGoods);
};
