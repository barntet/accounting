"use strict";

const Service = require("egg").Service;

class BillService extends Service {
  async add(params) {
    const { app } = this;

    try {
      // 往bill表中插入数据
      const result = await app.mysql.insert("bill", params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 列表查询
  async list(id) {
    const { app } = this;
    const QUERY_STRING = "id,pay_type,amount,date,type_id,type_name,remark";
    const sql = `select ${QUERY_STRING} from bill where user_id = ${id}`;
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = BillService;
