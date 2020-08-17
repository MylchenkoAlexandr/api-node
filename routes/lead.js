const router = require('express').Router();
const { create } = require('../app/controller/lead');

router.post('/create', create);

module.exports = router;