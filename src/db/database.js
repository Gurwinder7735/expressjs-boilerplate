const config = require('../config/config');

const databaseConfig = {
  development: {
    username: config.dev_db_username,
    password: config.dev_db_password,
    database: config.dev_db_name,
    host: config.dev_db_host,
    dialect: config.dev_db_dialect,
  },
  test: {
    username: config.test_db_username,
    password: config.test_db_password,
    database: config.test_db_name,
    host: config.test_db_host,
    dialect: config.test_db_dialect,
    logging: false
  },
  production: {
    username: config.prod_db_username,
    password: config.prod_db_password,
    database: config.prod_db_name,
    host: config.prod_db_host,
    dialect: config.prod_db_dialect,
    logging: false
  },
};
module.exports = databaseConfig;
