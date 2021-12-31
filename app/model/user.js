"use strict";

module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const User = app.model.define(
    "user",
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      username: STRING(100),
      password: STRING(100),
      signature: STRING(100),
      avatar: STRING(100),
      created_at: DATE,
      updated_at: DATE,
      created_time: DATE,
    },
    { freezeTableName: true }
  );
  return User;
};
