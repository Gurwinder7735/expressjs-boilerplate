'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'nameVisibility');
    await queryInterface.removeColumn('users', 'imageVisibility');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'nameVisibility', {
      type: Sequelize.BOOLEAN,
      allowNull: true, // Adjust based on your previous schema
    });
    await queryInterface.addColumn('users', 'imageVisibility', {
      type: Sequelize.BOOLEAN,
      allowNull: true, // Adjust based on your previous schema
    });
  }
};
