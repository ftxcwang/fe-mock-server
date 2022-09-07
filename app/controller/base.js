'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  success(data = {}, code = 0, msg = '') {
    this.ctx.body = {
        code,
        data,
        msg,
    };
  }
  
  notFound(msg = 'not found') {
    this.ctx.throw(404, msg);
  }
}

module.exports = BaseController;
