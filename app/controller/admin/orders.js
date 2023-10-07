'use strict';
const { Controller } = require('egg');

class OrdersController extends Controller {
  /**
   * 查询所有订单
   */
  async queryAllOrders() {
    const { ctx, app } = this;
    const { Op } = ctx.model.Sequelize;
    let { keyword } = ctx.request.body;
    if (keyword && typeof keyword === 'string') {
      keyword = keyword.trim();
    } else {
      keyword = '';
    }

    try {
      // 查询购物车与商品信息
      const orders = await ctx.service.orders.findAll({}, {
        // attributes: [ 'orderCode', 'shoppingCartCode', 'totalCount', 'totalPrice', 'expressWay', 'expressCode', 'status', 'createdAt' ],
        order: [[ 'updatedAt', 'desc' ]],
        where: {
          [Op.or]: [
            { orderCode: { [Op.like]: '%' + keyword + '%' } },
            { shoppingCartCode: { [Op.like]: '%' + keyword + '%' } },
            { expressCode: { [Op.like]: '%' + keyword + '%' } },
          ],
        },
        include: [{
          model: app.model.Goods,
          as: 'goods',
          attributes: [ 'goodsCode', 'goodsStatus', 'goodsTitle', 'goodsPrice', 'goodsOriginPrice' ],
          // where: {
          //   [Op.or]: [
          //     { goodsCode: { [Op.like]: '%' + keyword + '%' } },
          //     { goodsTitle: { [Op.like]: '%' + keyword + '%' } },
          //   ],
          // },
          through: {
            attributes: [ 'buyCount', 'goodsPrice' ],
          },
          order: [[ 'updatedAt', 'desc' ]],
          include: [{
            model: app.model.GoodsPictures,
            as: 'pictures',
            attributes: [ 'pictureCode', 'pictureUrl' ],
            through: {
              attributes: [],
            },
          }],
        }, {
          model: app.model.Users,
          as: 'user',
          attributes: [ 'userCode', 'userName', 'userNickname', 'userPhone' ],
        }],
      });

      // 待付款的订单，需要检查商品价格是否有变动，下单时要以商品当前价格下单
      const isPriceChangeMap = {};
      const needUpdateOrderCodes = [];
      const needUpdateOrders = [];
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        if (order.status !== ctx.service.orders.status.WAIT_PAY) {
          continue;
        }
        let totalPrice = 0;
        for (let j = 0; j < order.goods.length; j++) {
          totalPrice += order.goods[j].goodsPrice * order.goods[j].ordersGoodsRelations.buyCount;
          if (order.goods[j].goodsPrice !== order.goods[j].ordersGoodsRelations.goodsPrice) {
            isPriceChangeMap[order.orderCode] = true;
          }
          if (j === order.goods.length - 1 && isPriceChangeMap[order.orderCode] && needUpdateOrderCodes.indexOf(order.orderCode) < 0 && order.totalPrice !== totalPrice) {
            order.totalPrice = totalPrice;
            needUpdateOrders.push(order.toJSON());
            needUpdateOrderCodes.push(order.orderCode);
          }
        }
      }

      // 待付款的订单，价格变动时，重新更新订单总价
      if (needUpdateOrders.length > 0) {
        await ctx.service.orders.bulkCreate(needUpdateOrders, { updateOnDuplicate: [ 'totalPrice' ] });
      }

      return ctx.helper.responseSuccess({ data: orders });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 查询订单详情
   */
  async queryOrderDetails() {
    const { ctx, app } = this;
    const { orderCode } = ctx.request.body;

    if (!orderCode) {
      return ctx.helper.responseError({ message: '订单编码不能为空' });
    }

    try {
      // 查询购物车与商品信息
      const order = await ctx.service.orders.findOne({ orderCode }, {
        attributes: [ 'orderCode', 'shoppingCartCode', 'totalCount', 'totalPrice', 'expressWay', 'expressCode', 'expressAddress', 'payWay', 'userSignature', 'status', 'createdAt' ],
        include: [{
          model: app.model.Goods,
          as: 'goods',
          attributes: [ 'goodsCode', 'goodsStatus', 'goodsTitle', 'goodsPrice', 'goodsOriginPrice' ],
          through: {
            attributes: [ 'buyCount', 'goodsPrice' ],
          },
          order: [[ 'updatedAt', 'desc' ]],
          include: [{
            model: app.model.GoodsPictures,
            as: 'pictures',
            attributes: [ 'pictureCode', 'pictureUrl' ],
            through: {
              attributes: [],
            },
          }],
        }, {
          model: app.model.Users,
          as: 'user',
          attributes: [ 'userCode', 'userName', 'userNickname', 'userPhone' ],
        }],
      });

      // 待付款的订单，需要检查商品价格是否有变动，下单时要以商品当前价格下单
      if (order.status === ctx.service.orders.status.WAIT_PAY) {
        let isPriceChange = false;
        let totalPrice = 0;
        for (let i = 0; i < order.goods.length; i++) {
          if (order.goods[i].goodsPrice !== order.goods[i].ordersGoodsRelations.goodsPrice) {
            isPriceChange = true;
          }
          totalPrice += order.goods[i].goodsPrice * order.goods[i].ordersGoodsRelations.buyCount;
        }
        // 价格变动时，重新更新订单总价
        if (isPriceChange) {
          await ctx.service.orders.update({ totalPrice }, { orderCode: order.orderCode });
          order.totalPrice = totalPrice;
        }
      }

      return ctx.helper.responseSuccess({ data: order });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 添加订单
   */
  async addOrder() {
    const { ctx, app } = this;
    const { shoppingCartCode, expressWay, expressCode, expressAddress, payWay, orderStatus } = ctx.request.body;

    if (!shoppingCartCode) {
      return ctx.helper.responseError({ message: '购物车编码不能为空' });
    }
    if (orderStatus && !ctx.service.orders.status[orderStatus]) {
      return ctx.helper.responseError({ message: '订单状态不合法' });
    }
    if (payWay && !ctx.service.order.payWay[payWay]) {
      return ctx.helper.responseError({ message: '支付方式不合法' });
    }

    let transaction;
    try {
      // 查询购物车商品信息
      const shoppingCart = await ctx.service.shoppingCarts.findOne({}, {
        attributes: [ 'shoppingCartCode' ],
        where: {
          shoppingCartCode,
        },
        include: [{
          model: app.model.Goods,
          as: 'goods',
          attributes: [ 'goodsCode', 'goodsStatus', 'goodsPrice', 'goodsTitle', 'goodsInventory' ],
          through: {
            attributes: [ 'buyCount', 'selected' ],
            where: {
              selected: 1,
            },
          },
        }],
      });

      // 校验购物车信息
      if (!shoppingCart) {
        return ctx.helper.responseError({ message: '购物车不存在，请刷新页面再试' });
      }

      // 校验是否选择了商品
      if (!shoppingCart.goods || shoppingCart.goods.length < 1) {
        return ctx.helper.responseError({ message: '请先选购商品' });
      }

      // 校验商品库存，同时计算订单总数和总价
      let totalPrice = 0;
      let totalCount = 0;
      for (let i = 0; i < shoppingCart.goods.length; i++) {
        const { goodsInventory, goodsTitle, goodsStatus, goodsPrice, goodsShoppingCartsRelations } = shoppingCart.goods[i];
        if (goodsInventory < 1 || goodsInventory < goodsShoppingCartsRelations.buyCount) {
          return ctx.helper.responseError({ message: `您选购的商品“${goodsTitle}”库存不足` });
        }
        if (goodsStatus !== ctx.service.goods.status.NORMAL) {
          return ctx.helper.responseError({ message: `您选购的商品“${goodsTitle}”已下架` });
        }
        totalCount += goodsShoppingCartsRelations.buyCount;
        totalPrice += goodsPrice * goodsShoppingCartsRelations.buyCount;
      }

      // 启动事务
      transaction = await ctx.model.transaction();

      // 创建订单信息
      const orderCode = await ctx.service.orders.generateOrderCode();
      const orderInfo = {
        orderCode,
        shoppingCartCode,
        expressWay,
        expressCode,
        expressAddress,
        totalCount,
        totalPrice,
        payWay: payWay || ctx.service.orders.payWays.USER_BALANCE,
        status: orderStatus || ctx.service.orders.status.WAIT_PAY,
      };
      await ctx.service.orders.create(orderInfo, { transaction });

      // 创建订单与商品关联关系
      const relations = [];
      shoppingCart.goods.forEach(goods => {
        relations.push({
          orderCode,
          goodsCode: goods.goodsCode,
          shoppingCartCode,
          goodsPrice: goods.goodsPrice,
          buyCount: goods.goodsShoppingCartsRelations.buyCount,
        });
      });
      await ctx.service.ordersGoodsRelations.bulkCreate(relations, { transaction });

      // 提交事务
      transaction.commit();

      return ctx.helper.responseSuccess({ data: shoppingCart });
    } catch (error) {
      // 回滚事务
      transaction.rollback();
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 检查订单
   * @param orderCode 订单号
   * @param orderStatus 订单状态
   * @param isCheckStatus 校验订单状态是否合法
   */
  async checkOrderBeforeUpdate(orderCode, orderStatus, isCheckStatus = true) {
    const { ctx, app } = this;

    // 参数校验
    if (!orderCode) {
      return { message: '订单编码不能为空' };
    }

    try {
      // 查询订单信息
      const order = await ctx.service.orders.findOne({ orderCode }, {
        attributes: [ 'orderCode', 'expressWay', 'expressCode', 'status', 'shoppingCartCode', 'payWay', 'userCode', 'totalPrice' ],
        include: [{
          model: app.model.Goods,
          as: 'goods',
          attributes: [ 'goodsCode', 'goodsStatus', 'goodsPrice', 'goodsTitle', 'goodsInventory' ],
          // through: {
          //   attributes: [ 'buyCount' ],
          // },
        }],
      });

      // 校验订单是否存在
      if (!order) {
        return { message: '订单不存在，请刷新页面再试' };
      }
      if (orderStatus && !ctx.service.orders.status[orderStatus]) {
        return { message: '订单状态不合法，请检查' };
      }

      // 校验订单状态，待收货、已完成、已取消时不可修改任何信息
      const { WAIT_PAY, WAIT_SEND, WAIT_GET, FINISHED, CANCELED } = ctx.service.orders.status;
      if (isCheckStatus) {
        if (WAIT_GET === order.status) {
          return { message: '订单已发货，不可修改' };
        }
        if ([ FINISHED, CANCELED ].includes(order.status)) {
          return { message: '订单已完成，不可修改' };
        }
      }

      // 确保订单状态不可逆
      const orderStatusIndex = {
        [WAIT_PAY]: 1,
        [WAIT_SEND]: 2,
        [WAIT_GET]: 3,
        [FINISHED]: 4,
        [CANCELED]: 5,
      };
      if (orderStatus && orderStatusIndex[orderStatus] < orderStatusIndex[order.status]) {
        return { message: '订单状态不可逆，请检查' };
      }

      return { success: true, order };
    } catch (error) {
      console.error(error);
      return { message: '系统异常，请稍后再试' };
    }
  }

  /**
   * 更新商订单基础信息
   */
  async updateOrderBaseInfo() {
    const { ctx } = this;
    const { orderCode, orderStatus, expressWay, expressCode, expressAddress, payWay, userCode, userSignature } = ctx.request.body;

    // 检查参数
    if (!orderStatus && expressWay === undefined && expressCode === undefined && expressAddress === undefined && !userCode && !userSignature) {
      return ctx.helper.responseError({ message: '参数不能为空，请检查' });
    }
    // 检查订单基础信息
    const checkResult = await this.checkOrderBeforeUpdate(orderCode, orderStatus, false);
    if (!checkResult || !checkResult.success) {
      return ctx.helper.responseError({ message: checkResult.message });
    }
    // 检查订单状态参数
    if (orderStatus && !ctx.service.orders.status[orderStatus]) {
      return ctx.helper.responseError({ message: '订单状态不合法，请检查' });
    }
    // 检查支付方式参数
    if (payWay && !ctx.service.orders.payWays[payWay]) {
      return ctx.helper.responseError({ message: '支付方式状态不合法，请检查' });
    }

    let transaction;
    try {
      const { order } = checkResult;

      // 订单由待支付改为其他状态时，校验订单商品库存
      if (orderStatus && order.status === ctx.service.orders.status.WAIT_PAY && orderStatus !== order.status && orderStatus !== ctx.service.orders.status.CANCELED) {
        for (let i = 0; i < order.goods.length; i++) {
          if (order.goods[i].goodsInventory < 1) {
            return ctx.helper.responseError({ message: `商品“${order.goods[i].goodsTitle}”库存不足` });
          }
        }
      }

      // 启动事务
      transaction = await ctx.model.transaction();

      // 更新订单基础信息
      await ctx.service.orders.update({
        status: orderStatus || order.status,
        expressWay: expressWay || order.expressWay,
        expressCode: expressCode || order.expressCode,
        expressAddress: expressAddress || order.expressAddress,
        userCode: userCode || order.userCode,
        payWay: payWay || order.payWay,
        userSignature: userSignature || order.userSignature,
      }, { orderCode: order.orderCode }, { transaction });

      // 更新商品库存
      if (order.status === ctx.service.orders.status.WAIT_PAY && orderStatus !== order.status) {
        const needUpdateGoodsCodes = [];
        const goodsInventoryMap = {};
        order.goods.forEach(goodsItem => {
          needUpdateGoodsCodes.push(goodsItem.goodsCode);
          goodsInventoryMap[goodsItem.goodsCode] = goodsItem.goodsInventory - goodsItem.ordersGoodsRelations.buyCount;
        });
        const needUpdateGoods = await ctx.service.goods.findAll({ goodsCode: needUpdateGoodsCodes }, { raw: true });
        needUpdateGoods.forEach(needUpdateGoodsItem => {
          needUpdateGoodsItem.goodsInventory = goodsInventoryMap[needUpdateGoodsItem.goodsCode];
        });
        await ctx.service.goods.bulkCreate(needUpdateGoods, { updateOnDuplicate: [ 'goodsInventory' ], transaction });
      }

      // 完成订单时，如果使用余额支付，则扣减用户余额
      if (orderStatus !== order.status && orderStatus === ctx.service.orders.status.FINISHED && order.payWay === ctx.service.orders.payWays.USER_BALANCE) {
        if (!order.userCode) {
          // 回滚事务
          transaction.rollback();
          return ctx.helper.responseError({ message: '无法使用用户余额支付，请先关联用户' });
        }
        const user = await ctx.service.users.findOne({ userCode: order.userCode });
        if (!user) {
          // 回滚事务
          transaction.rollback();
          return ctx.helper.responseError({ message: '无法使用用户余额支付，关联用户不存在' });
        }
        if (!user.userBalance || user.userBalance < order.totalPrice) {
          // 回滚事务
          transaction.rollback();
          return ctx.helper.responseError({ message: `无法使用用户余额支付，用户余额不足。余额: ${user.userBalance} 元` });
        }
        const userBalance = user.userBalance - order.totalPrice;
        await ctx.service.users.update({ userBalance }, { userCode }, { transaction });
      }

      // 提交事务
      transaction.commit();

      return ctx.helper.responseSuccess({ data: true });
    } catch (error) {
      // 回滚事务
      transaction.rollback();
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 添加商品
   */
  async addOrderGoods() {
    const { ctx } = this;
    const { orderCode, goodsCode, buyCount } = ctx.request.body;

    // 检查订单基础信息
    const checkResult = await this.checkOrderBeforeUpdate(orderCode);
    if (!checkResult.success) {
      return ctx.helper.responseError({ message: checkResult.message });
    }
    // 检查参数
    if (!goodsCode) {
      return ctx.helper.responseError({ message: '商品编码不能为空' });
    }
    if (typeof buyCount !== 'number' || buyCount < 1) {
      return ctx.helper.responseError({ message: '购买数量只能是大于0的数字' });
    }

    let transaction;
    try {
      const { order } = checkResult;

      // 校验订单状态，仅待付款状态下可以修改商品信息
      const { WAIT_PAY } = ctx.service.orders.status;
      if (order.status !== WAIT_PAY) {
        return ctx.helper.responseError({ message: '订单已付款，不允许修改' });
      }

      // 检查商品是否已下架
      const goods = await ctx.service.goods.findOne({ goodsCode });
      if (!goods || goods.goodsStatus !== ctx.service.goods.status.NORMAL) {
        return ctx.helper.responseError({ message: '该商品已下架' });
      }

      // 校验商品库存
      if (goods.goodsInventory < buyCount) {
        return ctx.helper.responseError({ message: '该商品库存不足' });
      }

      // 启动事务
      transaction = await ctx.model.transaction();

      // 更新商品数量
      const orderGoods = order.goods.find(goodsItem => goodsItem.goodsCode === goodsCode);
      if (!orderGoods) {
        // 添加订单商品
        await ctx.service.ordersGoodsRelations.create({
          orderCode,
          goodsCode: goods.goodsCode,
          shoppingCartCode: order.shoppingCartCode,
          goodsPrice: goods.goodsPrice,
          buyCount,
        }, { transaction });
      } else {
        // 商品存在，则修改
        await ctx.service.ordersGoodsRelations.update({ buyCount, goodsPrice: goods.goodsPrice }, { orderCode, goodsCode }, { transaction });
      }

      // 实时获取商品信息，保证价格是实时的
      const relations = await ctx.service.ordersGoodsRelations.findAll({ orderCode }, { transaction });
      const goodses = await ctx.service.goods.findAll({ goodsCode: relations.map(relation => relation.goodsCode) }, { transaction });
      const goodsPriceMap = {};
      goodses.forEach(goods => {
        goodsPriceMap[goods.goodsCode] = goods;
      });
      // 更新订单总价格、总数量等信息
      let totalCount = 0;
      let totalPrice = 0;
      relations.forEach(relation => {
        const realBuyCount = relation.goodsCode === goodsCode ? buyCount : relation.buyCount;
        totalCount += realBuyCount;
        totalPrice += goodsPriceMap[relation.goodsCode].goodsPrice * realBuyCount;
      });
      await ctx.service.orders.update({ totalCount, totalPrice }, { orderCode }, { transaction });

      // 提交事务
      transaction.commit();

      return ctx.helper.responseSuccess({ data: true });
    } catch (error) {
      // 回滚事务
      transaction.rollback();
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 更新商品信息
   */
  async updateOrderGoodsBuyCount() {
    const { ctx } = this;
    const { orderCode, goodsCode, buyCount } = ctx.request.body;

    // 检查订单基础信息
    const checkResult = await this.checkOrderBeforeUpdate(orderCode);
    if (!checkResult.success) {
      return ctx.helper.responseError({ message: checkResult.message });
    }
    // 检查参数
    if (!goodsCode) {
      return ctx.helper.responseError({ message: '商品编码不能为空' });
    }
    if (typeof buyCount !== 'number') {
      return ctx.helper.responseError({ message: '购买数量只能是数字' });
    }

    let transaction;
    try {
      const { order } = checkResult;

      // 校验是否选择了商品
      if (!order.goods || order.goods.length < 1) {
        return ctx.helper.responseError({ message: '请先选购商品' });
      }

      // 校验订单状态，仅待付款状态下可以修改商品信息
      const { WAIT_PAY } = ctx.service.orders.status;
      if (order.status !== WAIT_PAY) {
        return ctx.helper.responseError({ message: '订单已付款，不允许修改' });
      }

      // 检查商品
      const goods = await ctx.service.goods.findOne({ goodsCode });
      if (!goods || goods.goodsStatus !== ctx.service.goods.status.NORMAL) {
        return ctx.helper.responseError({ message: '该商品已下架' });
      }

      // 启动事务
      transaction = await ctx.model.transaction();

      // 可修改商品信息时，变更购买的商品和商品数量
      if (buyCount < 1) {
        // 购买数量小于 1 时删除商品
        await ctx.service.ordersGoodsRelations.destroy({ orderCode, goodsCode }, { transaction });
      } else {
        // 更新商品数量
        if (!goods) {
          return ctx.helper.responseError({ message: '该商品已下架' });
        }
        // 校验商品库存
        if (goods.goodsInventory < buyCount) {
          return ctx.helper.responseError({ message: '该商品库存不足' });
        }
        await ctx.service.ordersGoodsRelations.update({ buyCount }, { orderCode, goodsCode }, { transaction });
      }

      // 实时获取商品信息，保证价格是实时的
      const relations = await ctx.service.ordersGoodsRelations.findAll({ orderCode }, { transaction });
      const goodses = await ctx.service.goods.findAll({ goodsCode: relations.map(relation => relation.goodsCode) }, { transaction });
      const goodsPriceMap = {};
      goodses.forEach(goods => {
        goodsPriceMap[goods.goodsCode] = goods;
      });
      // 更新订单总价格、总数量等信息
      let totalCount = 0;
      let totalPrice = 0;
      relations.forEach(relation => {
        const realBuyCount = relation.goodsCode === goodsCode ? buyCount : relation.buyCount;
        totalCount += realBuyCount;
        totalPrice += goodsPriceMap[relation.goodsCode].goodsPrice * realBuyCount;
      });
      await ctx.service.orders.update({ totalCount, totalPrice }, { orderCode }, { transaction });

      // 提交事务
      transaction.commit();

      return ctx.helper.responseSuccess({ data: true });
    } catch (error) {
      // 回滚事务
      transaction.rollback();
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 删除订单
   */
  async removeOrder() {
    const { ctx } = this;
    const { orderCode } = ctx.request.body;

    // 检查参数
    if (!orderCode) {
      return ctx.helper.responseError({ message: '订单编码不能为空' });
    }

    try {
      // 校验订单是否存在
      const order = await ctx.service.orders.findOne({ orderCode });
      if (!order) {
        return ctx.helper.responseError({ message: '订单不存在' });
      }

      // 删除订单
      await ctx.service.orders.destroy({ orderCode });

      return ctx.helper.responseSuccess({ data: true });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }
}

module.exports = OrdersController;
