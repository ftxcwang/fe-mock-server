'use strict';

module.exports = {
  // 封装响应数据格式
  responseData(data = {}, msg = 'success', code = 0, status = 200) {
    this.status = status;
    this.body = {
      code,
      data,
      msg,
    };
  },
};
