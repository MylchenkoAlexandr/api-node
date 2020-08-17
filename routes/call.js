const router = require('express').Router();
const { token, voice } = require('../app/controller/call');

router.get('/token', token);

router.post('/voice', voice);

module.exports = router;