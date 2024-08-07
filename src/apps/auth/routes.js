const { Router } = require('express');
const {
  login,
  socialLogin
} = require('./controller');
const validators = require("./validator");
const { authenticateRole } = require('../../middleware/passport');
const validator = require("express-joi-validation").createValidator({
  passError: true,
});


const router = Router();



router.get('/login',
  [validator.body(validators.login.body)],
  login);

router.post('/social-login',
  // [validator.body(validators.login.body)],
  socialLogin);

// router.get('/dashboard',
//   [authenticateRole("ADMIN")],
//   (req, res) => {
//     return res.send("Here is the dashboard")
//   });



module.exports = router;
