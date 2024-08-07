const path = require('path');
const { fileURLToPath } = require('url');
const dotenv = require('dotenv');

// Configure dotenv with the resolved path
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});
const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  cors_origin: process.env.CORS_ORIGIN,
  // dev db
  dev_db_name: process.env.DEV_DB_NAME,
  dev_db_username: process.env.DEV_DB_USERNAME,
  dev_db_password: process.env.DEV_DB_PASSWORD,
  dev_db_dialect: process.env.DEV_DB_DIALECT,
  dev_db_host: process.env.DEV_DB_HOST,

  // Acc db
  test_db_name: process.env.TEST_DB_NAME,
  test_db_username: process.env.TEST_DB_USERNAME,
  test_db_password: process.env.TEST_DB_PASSWORD,
  test_db_dialect: process.env.TEST_DB_DIALECT,
  test_db_host: process.env.TEST_DB_HOST,

  // Prod db
  prod_db_name: process.env.PROD_DB_NAME,
  prod_db_username: process.env.PROD_DB_USERNAME,
  prod_db_password: process.env.PROD_DB_PASSWORD,
  prod_db_dialect: process.env.PROD_DB_DIALECT,
  prod_db_host: process.env.PROD_DB_HOST,
};

module.exports = config;
