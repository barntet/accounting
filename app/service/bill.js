"use strict";

const Service = require("egg").Service;

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
  async list({ user_id, offset, limit }) {
    console.log("213", user_id, offset, limit);
    const { app } = this;
    // const QUERY_STRING = "id,pay_type,amount,date,type_id,type_name,remark";
    // const sql = `select ${QUERY_STRING} from bill where user_id = ${id}`;
    try {
      // const result = await app.mysql.query(sql);
      const result = await app.model.Bill.findAndCountAll(
        {
          where: { user_id },
          order: [["created_at", "DESC"]],
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
