const router = require('express').Router();
const DealsController = require('../app/controller/deals.controller');

router.post('/', DealsController.getDeals);

module.exports = router;