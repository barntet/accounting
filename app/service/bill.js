"use strict";

const Service = require("egg").Service;
const { Op } = require("sequelize");
const moment = require("moment");

class BillService extends Service {
  async add(params) {
    const { app } = this;

    try {
      // 往bill表中插入数据
      // const result = await app.mysql.insert("bill", params);
      const result = await app.model.Bill.create({ ...params });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 列表查询
  async list({ user_id, offset, limit, created_time }) {
    const { app } = this;
    try {
      const result = await app.model.Bill.findAndCountAll(
        {
          where: {
            [Op.and]: [
              { user_id },
              {
                created_time: {
                  [Op.gt]: moment(created_time).startOf("month").format(),
                  [Op.lt]: moment(created_time).endOf("month").format(),
                },
              },
            ],
          },
          order: [["created_time", "DESC"]],
        },
        offset,
        limit
      );
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = BillService;
