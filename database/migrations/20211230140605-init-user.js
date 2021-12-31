"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    // 在执行数据库升级时调用的函数，创建user表
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable("user", {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      username: STRING(100),
      password: STRING(100),
      signature: STRING(100),
      avatar: STRING(100),
      created_time: DATE,
      created_at: DATE,
      updated_at: DATE,
    });

    // await queryInterface.createTable("bill", {
    //   id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    //   amount: STRING(100),
    //   type_id: INTEGER,
    //   type_name: STRING(100),
    //   pay_type: INTEGER,
    //   remark: STRING(100),
    //   user_id: INTEGER,
    //   created_at: DATE,
    //   updated_at: DATE,
    // });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    // 在执行数据库降级时调用的函数，删除user表
    await queryInterface.dropTable("user");
  },
};
