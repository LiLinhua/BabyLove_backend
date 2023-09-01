const BaseService = require('./base');

class OrdersService extends BaseService {
  constructor(props = {}) {
    super({ ...props, modelName: 'Orders' });
  }

  /**
   * 订单状态
   */
  get status() {
    return {
      WAIT_PAY: 'WAIT_PAY', // 待付款
      WAIT_SEND: 'WAIT_SEND', // 待发货
      WAIT_GET: 'WAIT_GET', // 待收货
      FINISHED: 'FINISHED', // 已完成
      CANCELED: 'CANCELED', // 已取消
    };
  }

  /**
   * 支付方式
   */
  get payWays() {
    return {
      USER_BALANCE: 'USER_BALANCE', // 用户余额
      CASH: 'CASH', // 现金
      ALIPAY: 'ALIPAY', // 支付宝
      WECHAT: 'WECHAT', // 微信
    };
  }

  /**
   * 生成订单编码
   * @param number
   * @param count
   */
  async generateOrderCode(count = 1) {
    // const chars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    //   'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    //   'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
    // let res = '';
    // for (let i = 0; i < number; i++) {
    //   const id = Math.floor(Math.random() * 36);
    //   res += chars[id];
    // }
    if (count > 10) {
      throw new Error('订单编码生成失败，请重试');
    }

    // 随机生成订单编码
    let orderCode = Math.random().toString().substring(2, 15);
    // 校验订单编码唯一性
    const order = await this.findOne({ orderCode }, { attributes: [ 'id' ] });
    if (order) {
      orderCode = this.generateOrderCode(++count);
    }

    return orderCode;
  }
}

module.exports = OrdersService;
