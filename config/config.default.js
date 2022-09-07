/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1653310644416_1238';

  // add your middleware config here
  // config.middleware = ['tokenHandler'];

  // config.mysql = {
  //   // 单数据库信息配置
  //   client: {
     
  //   },
  //   // 是否加载到 app 上，默认开启
  //   app: true,
  //   // 是否加载到 agent 上，默认关闭
  //   agent: false,
  // };

  // config.security = {
  //   csrf: {
  //     enable: false
  //   },
  //   domainWhiteList: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  // };

  // config.cors = {
  //   origin: '*', // 匹配规则  域名+端口  *则为全匹配
  //   allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  // };
  config.cors = {
        credentials: true,
        origin: ctx => ctx.get('origin'),
        allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH'
    };
    config.security = {
        csrf: {
            enable: false
        },
        // domainWhiteList: []
    };

  // config.jwt = {
  //   secret: "654321"
  // };

  // config.tokenHandler = {
  //   match(ctx) { // 只匹配指定路由，反之如果只忽略指定路由，可以用ignore
  //     //匹配不需要验证token的路由
  //     const url = ctx.request.url;
  //     if (url.startsWith('/login')) {
  //       // ctx.logger.info('config.tokenHandler:','关闭token验证')
  //       return false;
  //     } else {
  //       // ctx.logger.info('config.tokenHandler:','开启token验证')
  //       return true; // 开启中间件，开启token验证
  //     }
  //   }
  // };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
