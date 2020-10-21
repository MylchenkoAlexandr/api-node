const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;
const { saveBeneficiary, getBeneficiaries,getAutoProcent } = require('../app/controller/beneficiary.controller');

router.put('/:lead_id/:beneficiary_number', authenticateToken, saveBeneficiary);
router.get('/:lead_id', authenticateToken, getBeneficiaries);
router.get('/:lead_id/:beneficiary_number/autoprocent', authenticateToken, getAutoProcent);

module.exports = router;