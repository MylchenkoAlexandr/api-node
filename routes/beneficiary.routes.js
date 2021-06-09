const router = require('express').Router();
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;
const BeneficiaryController = require('../app/controller/beneficiary.controller');

router.put('/:lead_id/:beneficiary_number', authenticateToken, BeneficiaryController.saveBeneficiary);
router.get('/:lead_id', authenticateToken, BeneficiaryController.getBeneficiaries);
router.get('/:lead_id/:beneficiary_number/autoprocent', authenticateToken, BeneficiaryController.getAutoProcent);

module.exports = router;