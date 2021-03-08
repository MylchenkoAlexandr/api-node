const router = require('express').Router();
const StatisticController = require('../app/controller/statistic.controller');

router.get('/', StatisticController.getStatistic());

module.exports = router;