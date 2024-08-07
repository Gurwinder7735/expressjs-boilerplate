'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'socialId', {
      type: Sequelize.STRING, // Change the type if needed
      allowNull: true, // Set to false if you want to require this field
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'socialId');
  },
};
