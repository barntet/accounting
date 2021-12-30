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
    await queryInterface.createTable(
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
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    // 在执行数据库降级时调用的函数，删除user表
    await quertyInterface.dropTable("user");
  },
};
