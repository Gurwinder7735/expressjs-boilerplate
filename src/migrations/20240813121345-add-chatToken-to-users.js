'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'chatToken', {
      type: Sequelize.STRING,
      allowNull: true, // Allow null values initially
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'chatToken');
  }
};
