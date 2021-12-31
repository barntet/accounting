"use strict";
const moment = require("moment");

module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
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
      created_time: DATE,
      created_at: DATE,
      updated_at: DATE,
    },
    {
      freezeTableName: true,
      updatedAt: "updated_at",
      createdAt: "created_at",
    }
  );
  return Bill;
};
