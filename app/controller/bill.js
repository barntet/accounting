"use strict";

const moment = require("moment");
const Controller = require("egg").Controller;

class BillController extends Controller {
  async add() {
    const { ctx, app } = this;
    // 获取请求中携带的参数
    const {
      amount,
      type_id,
      type_name,
      pay_type,
      remark = "",
    } = ctx.request.body;

    // 判空
    if (!amount || !type_id || !type_name || !pay_type) {
      ctx.body = {
        code: 400,
        msg: "参数错误",
        data: false,
      };
      return;
    }

    try {
      const token = ctx.request.header.authorization;
      // 获取用户信息
      const decode = app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) {
        return;
      }
      // user_id 默认添加到每个账单项，作为后续获取指定用户账单的标示
      // 可以理解为，登录用户A，那么所有操作都的加在A用户的id上
      const user_id = decode.id;
      const result = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date: moment().format("YYYY-MM-DD H:mm:ss"),
        pay_type,
        remark: remark || decode.remark || "",
        user_id,
      });
      if (!result) {
        ctx.body = {
          code: 500,
          msg: "系统错误",
          data: false,
        };
        return;
      }
      ctx.body = {
        code: 200,
        msg: "success",
        data: true,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: "系统错误",
        data: false,
      };
    }
  }

  async list() {
    const { ctx, app } = this;
    // 获取 日期，分页，类型 数据
    const { date = moment(), page = 1, size = 10, type_id = "all" } = ctx.query;
    try {
      // 通过tonken解析拿到user_id
      const token = ctx.request.header.authorization;
      // 通过uesrId获取用户信息
      const decode = app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) {
        return;
      }
      const user_id = decode.id;
      // 查询bill的账单列表(获取该用户的所以数据)
      const list = await ctx.service.bill.list(user_id);
      // 过滤对应条件的数据
      const filterList = list.filter((list) => {
        const isSame = moment(list.date).isSame(date, "day"); // 判断两个时间是否一致
        console.log("time", isSame);
        // type_id 不指定时查询对应的账单类型
        if (type_id !== "all") {
          return isSame && type_id === list.type_id;
        }
        return isSame;
      });
      // 当月支出
      const totalExpense = null;
      // 当月收入
      const totalIncome = null;
      ctx.body = {
        code: 200,
        msg: "success",
        data: {
          data: filterList,
          total: list.length,
          totalExpense, // 当月支出
          totalIncome, // 当月收入
        },
      };

      // 格式化
      //       const filterListMap = filterList.reduce((total, current) => {
      //         const date = moment(current.date).format("YYYY-MM-DD");

      //         const bills = [];
      // 	const isSame = moment(data).isSame(current.date,'day')
      // 	if(isSame){
      // 		bills.
      // 	}

      //         return total;
      //       }, []);
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: "error",
        data: false,
      };
    }
  }
}

module.exports = BillController;
