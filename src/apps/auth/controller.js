const asyncHandler = require('../../utils/error-handlers/catch-async.js');
const initModels = require('../../models/init-models.js');
const Models = require('../../models/index.js');
const { sendSuccess } = require('../../utils/response/response-utils.js');
const STATUS_CODES = require('../../utils/response/status-codes.js');
const { RESPONSE_MSGS } = require('../../utils/response/response-messages.js');
const controllerUtils = require('./controller-utils.js');
const CONSTANTS = require('../../constants/index.js');

const { users, userRoles, roles } = initModels(Models.sequelize);

module.exports = {

  login: asyncHandler(async (req, res, next) => {

    const user = await users.findByPk(1, {
      include: {
        model: userRoles,
        as: "userRoles",
        include: {
          model: roles,
          as: "role"
        }
      }
    });

    user.dataValues.token = controllerUtils.generateToken(user)
    user.dataValues.refreshToken = controllerUtils.generateRefreshToken(user)

    return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.DEFAULT, user)

  }),
  socialLogin: asyncHandler(async (req, res, next) => {

    const { email, given_name: firstName, family_name: lastName, picture: image, sub: socialId } = await controllerUtils.verifyGoogleToken(req.body.token)

    let user = await users.findOne({
      where: {
        socialId
      },
      raw: true
    });

    // Get the ID of the ADMIN role
    const getAllRoles = await roles.findAll({
      raw: true
    });


    const userRole = getAllRoles.find(role => role.roleName === CONSTANTS.APP.USER_ROLES.USER);


    if (!user) {
      user = await controllerUtils.createUser({
        email,
        firstName,
        lastName,
        image,
        socialId
      });

      await userRoles.create({
        roleId: userRole.id,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log("NEW USER CREATED SUCCESSFULLY.");
    }

    user = await controllerUtils.getUser(user.id);

    user.dataValues.token = controllerUtils.generateToken(user)
    user.dataValues.refreshToken = controllerUtils.generateRefreshToken(user)

    return sendSuccess(req, res, STATUS_CODES.SUCCESS, RESPONSE_MSGS.SUCCESS.DEFAULT, user)

  }),

};
