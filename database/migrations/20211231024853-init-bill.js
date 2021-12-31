"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // 执行数据升级时调用的函数，创建bill表
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable("bill", {
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
    });
    //
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // 在执行数据看降级是调用的函数，删除bill表
    await queryInterface.dropTable("bill");
  },
};
