'use strict';
const { v4: uuidv4 } = require('uuid');
const REQUESTID = Symbol('Context#requestId');

module.exports = {
/**
 * 请求唯一 ID
 */
  get requestId() {
    // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
    if (!this[REQUESTID]) {
      // 例如，从 header 中获取，实际情况肯定更复杂
      this[REQUESTID] = this.eagleeye && this.eagleeye.traceId || uuidv4();
    }
    return this[REQUESTID];
  },
};
