'use strict';

module.exports = {
  /**
   * 成功响应
   * @param {Object} res 响应
   * @param {number} res.code 响应码
   * @param {boolean} res.success 请求是否成功
   * @param {string} res.message 异常信息
   * @param {Object} res.data 响应数据
   */
  responseSuccess(res = {}) {
    const { code = 200, success = true, message = '成功', data = null } = res;

    this.ctx.body = { code, success, message, data, requestId: this.ctx.requestId };
  },
  /**
   * 失败响应
   * @param {Object} res 响应
   * @param {number} res.code 响应码
   * @param {boolean} res.success 请求是否成功
   * @param {string} res.message 异常信息
   * @param {Object} res.data 响应数据
   * @param {Object} error 错误信息
   */
  responseError(res = {}, error) {
    const { code = 200, success = false, message = '请求失败，请稍后再试', data = null } = res;

    if (error) {
      console.error(error);
    }

    this.ctx.body = { code, success, message, data, requestId: this.ctx.requestId };
  },
};
