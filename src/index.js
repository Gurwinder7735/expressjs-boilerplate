const db = require('./models/index.js');

try {
  const logger = require('./middleware/logger.js');
  const http = require('http');
  const { createServer } = http;

  const { Server } = require('socket.io');
  const { initializeSocketIO } = require('./lib/socket/socket-manager.js');
  const app = require('./app.js');
  const config = require('./config/config.js');

  const httpServer = createServer(app);


  const io = new Server(httpServer, {
    pingInterval: 25000,  // Send a ping every 25 seconds
    pingTimeout: 60000,   // Wait 60 seconds for a pong before closing the connection
    reconnectionAttempts: 5,
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  initializeSocketIO(io);

  app.set('io', io); // using set method to mount the `io` instance on the app to avoid usage of `global`

  httpServer.listen(config.port, () => {
    logger.log('info', `Server is running on Port: ${config.port}`);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.');
    logger.info('Closing http server.');
    httpServer.close((err) => {
      logger.info('Http server closed.');
      process.exit(err ? 1 : 0);
    });
  });

  db.sequelize.authenticate().then(() => {
    console.log("DB CONNECTED SUCCESSFULLY.")
  }).catch((err) => {
    console.log("ERROR", err);
  })
} catch (err) {
  console.log(err);
}
