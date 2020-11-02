const router = require('express').Router();
const UserController = require('../app/controller/user.controller');

router.post("/change-status", UserController.changeStatus);


module.exports = router;