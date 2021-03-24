const router = require('express').Router();
const StateController = require('../app/controller/state.controller');

router.get('/get-all', StateController.getAll);

module.exports = router;