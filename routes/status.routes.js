const router = require('express').Router();
const StatusController = require('../app/controller/status.controller');

router.get('/get-all', StatusController.getAll);

module.exports = router;