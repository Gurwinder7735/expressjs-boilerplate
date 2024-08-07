const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    phoneNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: ""
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    resetToken: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: ""
    },
    notifications: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    deviceType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    deviceToken: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: ""
    },
    socialId: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
