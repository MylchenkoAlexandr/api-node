const router = require('express').Router();
const TelcastController = require('../app/telcastAPI/telcast.controller');

router.post("/", TelcastController.index);

module.exports = router;