"use strict";
const moment = require("moment");

module.exports = (app) => {
  const { STRING, INTEGER, TIME } = app.Sequelize;
  const Bill = app.model.define(
    "bill",
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      amount: STRING(100),
      type_id: INTEGER,
      type_name: STRING(100),
      pay_type: INTEGER,
      remark: STRING(100),
      user_id: INTEGER,
      created_time: TIME,
      created_at: TIME,
      updated_at: TIME,
    },
    {
      freezeTableName: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
  return Bill;
};
