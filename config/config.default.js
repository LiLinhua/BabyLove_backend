/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

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
  config.keys = appInfo.name + '_1683948459379_4095';

  // 配置数据库连接
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'baby_love',
    username: 'root',
    password: '12345678',
    logging: true,
  };

  // 配置 xtpl 模板渲染
  config.view = {
    defaultViewEngine: 'xtpl',
    mapping: {
      '.html': 'xtpl',
    },
  };

  // 配置静态资源访问
  config.static = {
    prefix: '/public',
    dir: path.join(appInfo.baseDir, 'app/public'),
    gzip: true,
  };

  // add your middleware config here
  config.middleware = [ 'adminLogin' ];
  config.adminLogin = {
    enable: true,
    match: '/admin',
  };

  config.multipart = {
    fileSize: '50mb',
    mode: 'file',
    fileExtensions: [ '.png', '.jpg', '.jpeg', '.gif' ], // 扩展几种上传的文件格式
  };

  config.security = {
    csrf: {
      enable: false,
      queryName: 'x-csrf-token', // 通过 query 传递 CSRF token 的默认字段为 _csrf
      bodyName: 'x-csrf-token', // 通过 body 传递 CSRF token 的默认字段为 _csrf
      headerName: 'x-csrf-token', // 通过 body 传递 CSRF token 的默认字段为 _csrf
    },
  };

  const pictureDir = '/public/pictures';
  config.upload = {
    pictureDir,
    pictureFullDir: path.join(appInfo.baseDir, 'app', pictureDir),
  };

  config.login = {
    cookieName: 'babylove_token',
  };

  config.hy = {
    username: 'hy',
    password: 'liyuchen@1108..??',
  };

  return config;
};
