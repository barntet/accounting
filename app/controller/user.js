"use strict";

const Controller = require("egg").Controller;
const moment = require("moment");

// 默认头像，放在user.js最外层，避免重复什声明
const defaultAvatar =
  "http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png";

class UserController extends Controller {
  async register() {
    const { ctx } = this;
    // 注册需要的参数
    const { username, password } = ctx.request.body;
    // 数据判空处理
    if (!username || !password) {
      ctx.body = {
        code: 500,
        msg: "账号密码不能为空",
        data: false,
      };
      return;
    }

    // 验证数据库是否存在改用户名
    const userInfo = await ctx.service.user.getUserByName(username);
    console.log("123", userInfo);
    // 判断是否已经存在
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        msg: "账户已被注册，请重新输入",
        data: false,
      };
      return;
    }

    // 调用service方法将数据存入数据库
    const result = await ctx.service.user.register({
      username,
      password,
      signature: "好好学习",
      avatar: defaultAvatar,
      create_time: moment().format("YYYY-MM-DD H:mm:ss"),
    });
    console.log("rr", result);
    // if (result && result.insertId) {
    if (result && result.dataValues) {
      ctx.body = {
        code: 200,
        msg: "注册成功",
        data: true,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: "注册失败",
        data: false,
      };
    }
  }

  async login() {
    // app 为全局属性，相当于所有插件方法都植入到了app对象中
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    // 根据用户名，在数据库中查询相应id的操作
    const userInfo = await ctx.service.user.getUserByName(username);
    console.log('a',userInfo);
    // 没找到就是没有该用户
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: "账号不存在",
        daat: false,
      };
      return;
    }

    // 找到用户了，判断输入的密码与数据库的用户密码是否一致
    if (userInfo && password !== userInfo.password) {
      ctx.body = {
        code: 500,
        msg: "账号或密码错误",
        data: false,
      };
      return;
    }
    // 生成token
    // app.jwt.sign 该方法接收两个参数，第一个是对象，对象内是否需要加密的内容，第二个是加密字符串
    const token = app.jwt.sign(
      {
        id: userInfo.id,
        username: userInfo.username,
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // token 有效期24小时
      },
      app.config.jwt.secret
    );
    ctx.body = {
      code: 200,
      message: "登陆成功",
      data: { token },
    };
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    // 通过app.jwt.verity方法解析token的内容
    const decode = app.jwt.verify(token, app.config.jwt.secret);
    // 将decode.username 传入getUserByName 方法，获取用户名下的相关信息
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    ctx.body = {
      code: 200,
      msg: "success",
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature,
        avatar: userInfo.avatar || defaultAvatar,
      },
    };
  }

  // 修改用户信息
  async editUserInfo() {
    const { ctx, app } = this;
    // 通过post 请求，获取请求中的签名字段 signature
    const { signature = "", avatar = "" } = ctx.request.body;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) {
        return null;
      }
      const user_id = decode.id;
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      const result = await ctx.service.user.editUserInfo({
        ...userInfo.dataValues,
        signature: signature || userInfo.dataValues.signature,
        avatar: avatar || userInfo.dataValues.avatar,
      });
      console.log("re", result);
      ctx.body = {
        code: 200,
        msg: "success",
        data: {
          id: user_id,
          signature: signature || userInfo.dataValues.signature,
          username: userInfo.dataValues.username,
          avatar: avatar || userInfo.dataValues.avatar,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  // 验证token
  async test() {
    const { ctx, app } = this;
    // 通过token拿到user_id
    const token = ctx.request.header.authorization; // 请求头获取 authorization属性，值为token
    console.log("token", token);
    // 通过app.jwt.verify + 加密字符串 解析出token的值，
    const decode = app.jwt.verify(token, app.config.jwt.secret);
    console.log(decode);
    ctx.body = {
      code: 200,
      message: "success",
      data: {
        ...decode,
      },
    };
  }
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
//   .eyJpZCI6MiwidXNlcm5hbWUiOiJqYWNrIiwiZXhwIjoxNjQwNDg3NzQ5LCJpYXQiOjE2NDA0MDEzNDl9
//   .dsGm7bU2VydPpOm3iNnXOTSYVTurNH5WGhdQC - Z9LrQ;

module.exports = UserController;
