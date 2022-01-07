"use strict";

const moment = require("moment");
const Controller = require("egg").Controller;
const { PayTypeEnum } = require("./enum");

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
      created_time,
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
        pay_type,
        remark: remark || decode.remark || "",
        user_id,
        created_time: created_time || moment().format("YYYY-MM-DD H:mm:ss"),
        // created_at: custom_date || moment().format("YYYY-MM-DD h:mm:ss"),
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
        msg: "服务异常",
        data: false,
      };
    }
  }

  async list() {
    const { ctx, app } = this;
    // 获取 日期，分页，类型 数据
    const { created_time = moment(), page = 1, size = 10 } = ctx.query;
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
      const { count, rows } = await ctx.service.bill.list({
        user_id,
        limit: size,
        offset: (page - 1) * size,
        created_time,
      });
      const totalAmount = await ctx.service.bill.totalAmount({
        user_id,
        created_time,
      });

      // 计算总支出，总收入，如果未传入date则计算月的总支出，总收入
      const computedTotal = (type, date) => {
        const nextDate = moment(date).add(1, "days");
        return totalAmount.reduce((total, current) => {
          if (
            type === current.pay_type &&
            (moment(current.created_time).isBetween(
              date,
              nextDate,
              "days",
              []
            ) ||
              !date)
          ) {
            total += parseFloat(current.amount);
          }
          return total;
        }, 0);
      };

      const data = rows.reduce((total, current) => {
        const date = moment(current.created_time).format("YYYY-MM-DD");
        if (date in total && total[date]?.days?.length) {
          total[date].days.push(current);
        } else {
          total[date] = {
            days: [current],
            dayExpense: computedTotal(PayTypeEnum.Expense, date),
            dayIncome: computedTotal(PayTypeEnum.Income, date),
          };
        }
        return total;
      }, {});

      // 当月支出
      const monthExpense = computedTotal(PayTypeEnum.Expense);
      // 当月收入
      const monthIncome = computedTotal(PayTypeEnum.Income);
      ctx.body = {
        code: 200,
        msg: "success",
        data: {
          count,
          data,
          monthExpense, // 当月支出
          monthIncome, // 当月收入
          totalAmount,
        },
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: "服务异常",
        data: false,
      };
    }
  }

  async edit() {
    const { app, ctx } = this;
    // 获取请求中携带的参数
    const {
      amount,
      type_id,
      type_name,
      pay_type,
      remark = "",
      created_time,
      id,
    } = ctx.request.body;

    // 判空
    if (!amount || !type_id || !type_name || !pay_type || !id) {
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
      await ctx.service.bill.edit(
        {
          amount,
          type_id,
          type_name,
          pay_type,
          remark,
          created_time: created_time || moment().format("YYYY-MM-DD H:mm:ss"),
        },
        [decode.id],
        id
      );
      ctx.body = {
        code: 200,
        msg: " success",
        data: true,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: "服务异常",
        data: false,
      };
    }
  }

  async delete() {
    const { app, ctx } = this;
    try {
      const { id } = ctx.request.body;
      if (!id) {
        ctx.body = {
          code: 200,
          msg: "参数错误",
          data: false,
        };
        return;
      }
      const token = ctx.request.header.authorization;
      const decode = app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) {
        return;
      }
      const result = await ctx.service.bill.delete(id, decode.id);

      console.log(result);
      ctx.body = {
        code: 200,
        msg: "success",
        data: !!result,
      };
    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: "服务异常",
        data: false,
      };
    }
  }
}

module.exports = BillController;
