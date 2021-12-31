/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_";

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',

    uploadDir: "app/public/upload",
  };

  // whitelist
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ["*"],
  };

  // mapping
  config.view = {
    mapping: { ".html": "ejs" },
  };

  // config.mysql = {
  //   // 单数据库信息配置
  //   client: {
  //     // host
  //     host: "localhost",
  //     // 端口号
  //     port: 3306,
  //     // 用户名
  //     user: "root",
  //     // 密码
  //     password: "mysqlhhxx0@",
  //     // 数据库名
  //     database: "ledger",
  //   },
  //   // 是否加载到app上。默认开启
  //   app: true,
  //   // 是否加载到agent上，默认关闭
  //   agent: false,
  // };

  config.sequelize = {
    dialect: "mysql",
    host: "127.0.0.1",
    port: 3306,
    database: "dev-ledger",
    username: "root",
    password: "mysqlhhxx0@",
  };

  // 鉴权
  config.jwt = {
    secret: "abc",
  };

  // 读取文件，直接读取文件
  config.multipart = {
    mode: "file",
  };

  // cors
  config.cors = {
    origin: "*", // 允许所有跨越
    credentials: true, //允许cookie 跨域
    allowMethods: "GET,PUT,POST,DELETE,PATCH,HEAD",
  };

  return {
    ...config,
    ...userConfig,
  };
};
