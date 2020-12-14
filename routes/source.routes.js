const router = require('express').Router();
const SourceController = require('../app/controller/source.controller');

router.get('/get-all', SourceController.getAll);

module.exports = router;