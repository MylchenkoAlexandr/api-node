const router = require('express').Router();
const SettigsController = require('../app/controller/settings.controller');

router.get('/get', SettigsController.getSettings);
router.post('/update', SettigsController.update);

module.exports = router;