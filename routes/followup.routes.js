const router = require('express').Router();
const FollowUpController = require('../app/controller/followup.controller');

router.get("/:lead_id", FollowUpController.get);
router.post("/create", FollowUpController.create);
router.post("/update", FollowUpController.update);
router.post("/delete", FollowUpController.delete);

module.exports = router;