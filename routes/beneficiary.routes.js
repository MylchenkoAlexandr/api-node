const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/auth.middleware');
const { saveBeneficiary, getBeneficiary } = require('../app/controller/beneficiary.controller');

router.post('/save', authenticateToken, saveBeneficiary);
router.get('/get/:lead_id', authenticateToken, getBeneficiary);

module.exports = router;