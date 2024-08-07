const { getChatEventName } = require("../../utils/helpers");

module.exports = {
  CHAT_EVENTS: {
    CONNECTED_EVENT: "connected",
    DISCONNECT_EVENT: "disconnect",
    JOIN_CHAT_EVENT: getChatEventName("joinChat"),
    NEW_CHAT_EVENT: getChatEventName("newChat"),
    TYPING_EVENT: getChatEventName("typing"),
    STOP_TYPING_EVENT: getChatEventName("stopTyping"),
    MESSAGE_RECEIVED_EVENT: getChatEventName("messageReceived"),
    LEAVE_CHAT_EVENT: getChatEventName("leaveChat"),
    UPDATE_GROUP_NAME_EVENT: getChatEventName("updateGroupName"),
    MESSAGE_DELETE_EVENT: getChatEventName("messageDeleted"),
    ONLINE: getChatEventName("online"),
    OFFLINE: getChatEventName("offline"),
    READ_UNREAD_COUNT: getChatEventName("readUnreadCount"),
    NEW_CHAT: getChatEventName("newChat"),
    MESSAGE_EDITED: getChatEventName("messageEdited"),
  },
};
