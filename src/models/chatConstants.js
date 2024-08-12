const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('chatConstants', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    user1Id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    user2Id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    lastMessageId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'chatMessages',
        key: 'id'
      }
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    archivedBy: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'chatConstants',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "chatConstants_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
