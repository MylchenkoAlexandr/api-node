const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;
const { saveBeneficiary, getBeneficiaries } = require('../app/controller/beneficiary.controller');

router.put('/:beneficiary_number', authenticateToken, saveBeneficiary);
router.get('/:lead_id', authenticateToken, getBeneficiaries);

module.exports = router;