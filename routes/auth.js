const router = require('express').Router();
const { login, verify } = require('../app/controller/authController');

router.post('/signin', login);
router.post('/verify', verify);
/**
 * TODO Create function of sigOut 
 * router.post('/sign-out', signOut)
 */

// router.post('/registration', registration);

module.exports = router;