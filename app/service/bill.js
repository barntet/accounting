"use strict";

const Service = require("egg").Service;
const { Op } = require("sequelize");
const moment = require("moment");

class BillService extends Service {
  async add(params) {
    try {
      // 往bill表中插入数据
      // const result = await app.mysql.insert("bill", params);
      const result = await this.app.model.Bill.create({ ...params });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 列表查询
  async list({ user_id, offset, limit, created_time }) {
    try {
      const result = await this.app.model.Bill.findAndCountAll(
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
      throw error;
    }
  }

  // 当月总支出
  async totalAmount({ user_id, created_time }) {
    try {
      const result = await this.app.model.Bill.findAll({
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
        attributes: ["amount", "pay_type", "created_time"],
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  // 编辑数据
  async edit(params, user_id, id) {
    try {
      const result = await this.app.model.Bill.update(
        { ...params },
        {
          where: { [Op.and]: [{ user_id }, { id }] },
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async delete(id, user_id) {
    try {
      const result = await this.app.model.Bill.destroy({
        where: { [Op.and]: [{ user_id }, { id }] },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BillService;
