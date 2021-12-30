"use strict";

module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const User = app.model.define(
    "user",
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      created_at: DATE,
      username: STRING(100),
      password: STRING(100),
      signature: STRING(100),
      avatar: STRING(100),
      create_time: DATE,
      updated_at: DATE,
    },
    { freezeTableName: true }
  );
  return User;
};
