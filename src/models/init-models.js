var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _chatConstants = require("./chatConstants");
var _chatMessages = require("./chatMessages");
var _roles = require("./roles");
var _userRoles = require("./userRoles");
var _users = require("./users");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var chatConstants = _chatConstants(sequelize, DataTypes);
  var chatMessages = _chatMessages(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var userRoles = _userRoles(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  chatMessages.belongsTo(chatConstants, { as: "chat", foreignKey: "chatId"});
  chatConstants.hasMany(chatMessages, { as: "chatMessages", foreignKey: "chatId"});
  chatConstants.belongsTo(chatMessages, { as: "lastMessage", foreignKey: "lastMessageId"});
  chatMessages.hasMany(chatConstants, { as: "chatConstants", foreignKey: "lastMessageId"});
  userRoles.belongsTo(roles, { as: "role", foreignKey: "roleId"});
  roles.hasMany(userRoles, { as: "userRoles", foreignKey: "roleId"});
  chatConstants.belongsTo(users, { as: "deletedBy_user", foreignKey: "deletedBy"});
  users.hasMany(chatConstants, { as: "chatConstants", foreignKey: "deletedBy"});
  chatConstants.belongsTo(users, { as: "user1", foreignKey: "user1Id"});
  users.hasMany(chatConstants, { as: "user1_chatConstants", foreignKey: "user1Id"});
  chatConstants.belongsTo(users, { as: "user2", foreignKey: "user2Id"});
  users.hasMany(chatConstants, { as: "user2_chatConstants", foreignKey: "user2Id"});
  chatMessages.belongsTo(users, { as: "deletedBy_user", foreignKey: "deletedBy"});
  users.hasMany(chatMessages, { as: "chatMessages", foreignKey: "deletedBy"});
  chatMessages.belongsTo(users, { as: "receiver", foreignKey: "receiverId"});
  users.hasMany(chatMessages, { as: "receiver_chatMessages", foreignKey: "receiverId"});
  chatMessages.belongsTo(users, { as: "sender", foreignKey: "senderId"});
  users.hasMany(chatMessages, { as: "sender_chatMessages", foreignKey: "senderId"});
  userRoles.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(userRoles, { as: "userRoles", foreignKey: "userId"});

  return {
    SequelizeMeta,
    chatConstants,
    chatMessages,
    roles,
    userRoles,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
