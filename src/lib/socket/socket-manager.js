const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const AppError = require('../../utils/error-handlers/app-error.js');
const { CHAT_EVENTS } = require('./chat-events.js');
const models = require('../../models');
const initModels = require('../../models/init-models.js');
const db = require('../../models');

const { users } = initModels(db.sequelize);

module.exports = {
  mountJoinChatEvent: (socket) => {
    socket.on(CHAT_EVENTS.JOIN_CHAT_EVENT, (chatId) => {
      console.log(`User joined the chat 🤝. chatId: `, chatId);
      socket.join(chatId);
    });
  },

  mountParticipantTypingEvent: (socket) => {
    socket.on(CHAT_EVENTS.TYPING_EVENT, (chatId) => {
      socket.in(chatId).emit(CHAT_EVENTS.TYPING_EVENT, chatId);
    });
  },

  mountParticipantStoppedTypingEvent: (socket) => {
    socket.on(CHAT_EVENTS.STOP_TYPING_EVENT, (chatId) => {
      socket.in(chatId).emit(CHAT_EVENTS.STOP_TYPING_EVENT, chatId);
    });
  },

  initializeSocketIO: (io) => {

    return io.on('connection', async (socket) => {
      try {

        const token = socket.handshake.auth.token || socket.handshake.headers.auth;



        if (!token) {
          // Token is required for the socket to work
          throw new AppError(401, 'Un-authorized handshake. Token is missing');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY); // decode the token


        const userId = decodedToken.id;
        const user = await models.users.findOne({
          where: {
            id: userId,
          },
          raw: true,
        });

        if (!user) {
          throw new AppError('Invalid user.', 401);
        }

        await users.update(
          { is_online: true }, // The new values to update
          { where: { id: userId } } // The condition to match the record
        );

        socket.broadcast.emit(CHAT_EVENTS.ONLINE, {
          userId,
        });

        socket.user = user;

        socket.join(user.id.toString());
        socket.emit(CHAT_EVENTS.CONNECTED_EVENT);
        console.log('User connected 🗼. userId: ', user.id.toString());

        module.exports.mountJoinChatEvent(socket);
        module.exports.mountParticipantTypingEvent(socket);
        module.exports.mountParticipantStoppedTypingEvent(socket);

        socket.on(CHAT_EVENTS.DISCONNECT_EVENT, (reason) => {

          console.log('user has disconnected 🚫. userId: ' + socket.user?.id + ': reason ' + reason);

          if (socket.user?.id) {
            users.update(
              { is_online: 0 }, // The new values to update
              { where: { id: socket.user?.id } } // The condition to match the record
            );
            socket.broadcast.emit(CHAT_EVENTS.OFFLINE, {
              userId: socket.user?.id,
            });
            socket.leave(socket.user.id);

          }
        });
      } catch (error) {
        console.log(error);
        socket.emit(
          CHAT_EVENTS.SOCKET_ERROR_EVENT,
          error?.message ||
          'Something went wrong while connecting to the socket.'
        );
        // Handle error
      }
    });
  },

  emitSocketEvent: (req, roomId, event, payload) => {
    req.app.get('io').in(roomId).emit(event, payload);
  },
};
