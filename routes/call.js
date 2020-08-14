const router = require('express').Router();
const { token, voice } = require('../app/controller/call');

router.get('/token', token);

router.get('/voice', voice);

module.exports = router;