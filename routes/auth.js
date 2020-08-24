const router = require('express').Router();
const { login } = require('../app/controller/authController');

router.post('/signin', login);
/**
 * TODO Create function of sigOut 
 * router.post('/sign-out', signOut)
 */

// router.post('/registration', registration);

module.exports = router;