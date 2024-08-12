const Joi = require('joi');

const validator = {};

validator.createChat = {
  params: Joi.object({
    receiverSlug: Joi.any().required(),
  }),
};


validator.getChat = {
  params: Joi.object({
    chatId: Joi.any().required(),
  }),

};
validator.sendMessage = {
  params: Joi.object({
    receiverId: Joi.any().required(),
  }),
  body: Joi.object({
    message: Joi.string().required(),
  }),
};
validator.readMessages = {
  params: Joi.object({
    chatId: Joi.any().required(),
  })
};
validator.deleteChat = {
  params: Joi.object({
    id: Joi.any().required(),
  })
};

validator.editMessage = {
  params: Joi.object({
    id: Joi.any().required(),
  }),
  body: Joi.object({
    message: Joi.string().required(),
  })
};

validator.archieve = {
  params: Joi.object({
    id: Joi.any().required(),
    status: Joi.number().valid(0, 1).required(),
  }),
};

module.exports = validator;
