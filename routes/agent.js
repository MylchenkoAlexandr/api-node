const router = require('express').Router();
const {createAgent} = require('../app/controller/agentController');


router.post('/create', createAgent);
// router.post('/update', verify);
// router.post('/delete', verify);

module.exports = router;