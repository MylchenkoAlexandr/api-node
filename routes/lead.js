const router = require('express').Router();
const { create } = require('../app/controller/leadController');

router.post('/create', create);

module.exports = router;