const router = require('express').Router();
const SettigsController = require('../app/controller/settings.controller');

router.get('/get', SettigsController.getSettings);
router.post('/update', SettigsController.update);
router.post('/update-fields', SettigsController.updateFields);

module.exports = router;