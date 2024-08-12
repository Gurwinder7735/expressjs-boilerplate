const config = require('../config/config');

const databaseConfig = {
  development: {
    username: config.dev_db_username,
    password: config.dev_db_password,
    database: config.dev_db_name,
    host: config.dev_db_host,
    dialect: config.dev_db_dialect,
    define: {
      underscored: false, // Expect camelCase
      freezeTableName: true, // Prevent Sequelize from pluralizing table names

    },
  },
  test: {
    username: config.test_db_username,
    password: config.test_db_password,
    database: config.test_db_name,
    host: config.test_db_host,
    dialect: config.test_db_dialect,
    logging: false,
    define: {
      underscored: false, // Expect camelCase
      freezeTableName: true, // Prevent Sequelize from pluralizing table names
    },
  },
  production: {
    username: config.prod_db_username,
    password: config.prod_db_password,
    database: config.prod_db_name,
    host: config.prod_db_host,
    dialect: config.prod_db_dialect,
    logging: false,
    define: {
      underscored: false, // Expect camelCase
      freezeTableName: true, // Prevent Sequelize from pluralizing table names
    },
  },
};
module.exports = databaseConfig;
