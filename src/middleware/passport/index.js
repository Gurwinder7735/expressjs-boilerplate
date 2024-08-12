const passport = require("passport");

const Models = require("../../models")

const AppError = require("../../utils/error-handlers/app-error");
const { APP } = require("../../constants");
const { RESPONSE_MSGS } = require("../../utils/response/response-messages");
const initModels = require("../../models/init-models");
const STATUS_CODES = require("../../utils/response/status-codes");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;

const { users, userRoles, roles } = initModels(Models.sequelize);


// Define the strategy for each role
const strategies = {
    default: new JwtStrategy(opts, async (payload, done) => {
        try {



            const user = await users.findByPk(payload.id, {
                include: {
                    model: userRoles,
                    as: "userRoles",
                    include: {
                        model: roles,
                        as: "role"
                    }
                },
                raw: true,
                nest: true
            });



            if (user) {
                user.role = user?.userRoles?.role?.roleName;
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    }),
};

// Example usage: Determine the role based on the strategy's info object

Object.keys(APP.USER_ROLES).forEach((role) => {
    passport.use(role, strategies.default);
});
passport.use("all", strategies.default);


// Middleware function to authenticate different roles
function authenticateRole(role = "all") {

    return function (req, res, next) {
        return passport.authenticate(
            role,
            {
                session: false,
            },
            (err, user) => {

                console.log(err, ">>>>>>>>>>>>>>>>>>>>>");

                if (err && err.name && err.name === "JsonWebTokenError") {
                    return next(new AppError(RESPONSE_MSGS.ERROR.INVALID_TOKEN, STATUS_CODES.ROLE_CHANGE));
                }

                if (err) {
                    console.log(err, "err>>>>");
                    return next(new AppError(RESPONSE_MSGS.ERROR.TOKEN_MISSING, STATUS_CODES.ROLE_CHANGE));
                }

                console.log(user, "????????????????");

                if (!user) {
                    return next(new AppError(RESPONSE_MSGS.ERROR.TOKEN_MISSING, STATUS_CODES.ROLE_CHANGE));
                }

                if (role !== "all") {
                    role = !Array.isArray(role) ? [role] : role;
                    if (!role.includes(user.role)) {
                        return next(new AppError(RESPONSE_MSGS.ERROR.UNAUTHORIZED, STATUS_CODES.ROLE_CHANGE));
                    }
                }

                req.user = user
                next();
            }
        )(req, res, next);
    };
}

module.exports = {
    initialize: () => passport.initialize(),
    authenticateRole,
};
