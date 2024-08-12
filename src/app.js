try {
  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const config = require('./config/config.js');

  const bodyParser = require('body-parser');
  const authRouter = require('./apps/auth/index.js');
  const chatRouter = require('./apps/chat/index.js');
  const errorHandler = require('./middleware/error-handler.js');
  const app = express();
  const passport = require("./middleware/passport")
  app.use(
    cors({
      // origin is given a array if we want to have multiple origins later
      origin: '*',
      // credentials: true,
    })
  );

  // Helmet is used to secure this app by configuring the http-header
  app.use(helmet());

  // parse application/json
  app.use(bodyParser.json());

  app.use('/api/auth', [authRouter]);
  app.use('/api/chat', [chatRouter]);

  app.use(errorHandler);

  module.exports = app;
} catch (err) {
  console.log(err);
}
