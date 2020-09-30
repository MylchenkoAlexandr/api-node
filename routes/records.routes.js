const router = require('express').Router();
const { getAllRecords } = require('../app/controller/records.controller');
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;

router.get('/:lead_id', authenticateToken, getAllRecords);

module.exports = router;