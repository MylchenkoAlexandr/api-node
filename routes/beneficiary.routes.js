const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;
const { saveBeneficiary, getBeneficiary } = require('../app/controller/beneficiary.controller');

router.post('/save', authenticateToken, saveBeneficiary);
router.get('/:lead_id', authenticateToken, getBeneficiary);

module.exports = router;