'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      phoneNumber: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      password: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: "",
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      firstName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      lastName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      nameVisibility: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "",
      },
      imageVisibility: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      otp: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      resetToken: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: "",
      },
      notifications: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      deviceType: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      deviceToken: {
        type: Sequelize.STRING(500),
        allowNull: false,
        defaultValue: "",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
    await queryInterface.dropTable('users');
  }
};
