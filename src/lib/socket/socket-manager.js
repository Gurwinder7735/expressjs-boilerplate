const { CHAT_EVENTS } = require('./chat-events.js');

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



      } catch (error) {

      }
    });
  },

  emitSocketEvent: (req, roomId, event, payload) => {
    req.app.get('io').in(roomId).emit(event, payload);
  },
};
