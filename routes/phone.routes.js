const router = require('express').Router();
const PhoneController = require('../app/controller/phone.controller');

router.get('/get/:id', PhoneController.get);
router.post('/update', PhoneController.update);

module.exports = router;