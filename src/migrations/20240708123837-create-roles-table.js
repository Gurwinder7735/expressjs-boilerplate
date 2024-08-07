'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      roleName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    }, {
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          fields: ['id'],
        },
      ],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles');
  }
};
