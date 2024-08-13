const db = require("../../models");
const initModels = require("../../models/init-models");

const { chatMessages, users } = initModels(db.sequelize);

module.exports = {
    getUnreadMessagesCount: async (userId) => {

        const unreadMessages = await chatMessages.count({
            where: {
                receiverId: userId,
                isRead: false
            }
        });

        return unreadMessages;
    },
    getUserFromChatToken: async (chatToken) => {

        const user = await users.findOne({
            where: {
                chatToken
            },
            raw: true
        });

        return user;
    }
}
