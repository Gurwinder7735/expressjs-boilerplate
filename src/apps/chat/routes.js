const { Router } = require('express');
const {
  login,
  socialLogin,
  createChat,
  getAllChats,
  getChat,
  sendMessage,
  readMessages,
  deleteChat,
  editMessage
} = require('./controller');
const validators = require("./validator");
const { authenticateRole } = require('../../middleware/passport');
const validator = require("express-joi-validation").createValidator({
  passError: true,
});


const router = Router();

router.use(authenticateRole("USER"));


router.post('/:receiverSlug', validator.params(validators.createChat.params), createChat);
router.get('/all', getAllChats);
router.get('/:chatId', validator.params(validators.getChat.params), getChat);
router.post('/send-message/:receiverId', [validator.params(validators.sendMessage.params), validator.body(validators.sendMessage.body)], sendMessage);
router.put('/read-messages/:chatId', validator.params(validators.readMessages.params), readMessages);
router.delete('/:id', validator.params(validators.deleteChat.params), deleteChat);
router.put('/message/:id', [validator.params(validators.editMessage.params), validator.body(validators.editMessage.body)], editMessage);








module.exports = router;
