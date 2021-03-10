const router = require('express').Router();
const StatisticController = require('../app/controller/statistic.controller');

router.post('/', StatisticController.getStatistic);

module.exports = router;