const router = require('express').Router();
const UserController = require('../app/controller/user.controller');

router.post("/update", UserController.updateColumns);
router.post("/get-status", UserController.getStatus);
router.post("/change-status", UserController.changeStatus);


module.exports = router;