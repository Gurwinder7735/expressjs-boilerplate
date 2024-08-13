const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const initModels = require("../../models/init-models");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const Models = require('../../models/index.js');
const { v4: uuidv4 } = require('uuid');

const { users, userRoles, roles } = initModels(Models.sequelize);

module.exports = {
    generateToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user?.userRoles?.[0]?.role?.roleName,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: process.env.JWT_EXPIRE_TIME,
            }
        );
    },

    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user?.userRoles?.[0]?.role?.roleName,
            },
            process.env.JWT_REFRESH_SECRET_KEY,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
            }
        );
    },
    verifyGoogleToken: async (token) => {
        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: token,
        });

        // Get the payload (user info) from the verified token
        const payload = ticket.getPayload();
        return payload;

    },

    createUser: async (payload) => {


        const user = await users.create(payload);

        return user

    },
    getUser: async (id) => {
        const user = await users.findByPk(id, {
            attributes: ["id", "email", "firstName", "lastName", "image", "socialId", "chatToken"]
        });
        return user
    },
    generateChatId: () => {
        const uuid = uuidv4().replace(/-/g, ''); // Remove hyphens from UUID
        const uniqueId = `CHAT-${uuid.slice(0, 12).toUpperCase()}`; // Truncate to fit within 16 characters
        return uniqueId;
    },
}