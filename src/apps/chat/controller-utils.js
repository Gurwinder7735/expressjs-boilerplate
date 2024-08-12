const db = require("../../models");
const initModels = require("../../models/init-models");

const { chatMessages } = initModels(db.sequelize);

module.exports = {
    getUnreadMessagesCount: async (userId) => {

        const unreadMessages = await chatMessages.count({
            where: {
                receiverId: userId,
                isRead: false
            }
        });

        return unreadMessages;
    }
}
