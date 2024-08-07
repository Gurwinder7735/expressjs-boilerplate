var DataTypes = require("sequelize").DataTypes;
var _SequelizeMeta = require("./SequelizeMeta");
var _roles = require("./roles");
var _userRoles = require("./userRoles");
var _users = require("./users");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var userRoles = _userRoles(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  userRoles.belongsTo(roles, { as: "role", foreignKey: "roleId"});
  roles.hasMany(userRoles, { as: "userRoles", foreignKey: "roleId"});
  userRoles.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(userRoles, { as: "userRoles", foreignKey: "userId"});

  return {
    SequelizeMeta,
    roles,
    userRoles,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
