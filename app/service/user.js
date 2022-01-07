"use strict";
const Service = require("egg").Service;

class UserService extends Service {
  // 通过用户名获取用户信息
  async getUserByName(username) {
    const { app } = this;
    try {
      // const result = await app.mysql.get("user", { username });
      const result = await app.model.User.findOne({ where: { username } });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 注册
  async register(params) {
    const { app } = this;
    try {
      // const result = await app.mysql.insert("user", params);
      const result = await app.model.User.create({ ...params });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 修改用户信息
  async editUserInfo(params) {
    const { app } = this;
    console.log("parmas", params);
    try {
      const result = await app.model.User.update(
        { ...params },
        { where: { username: params.username } }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
