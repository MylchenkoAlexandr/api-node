const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/authMiddleware');
const { createBeneficiary, getBeneficiary } = require('../app/controller/beneficiaryController');

router.post('/create', authenticateToken, createBeneficiary);
router.get('/get/:lead_id', authenticateToken, getBeneficiary);

module.exports = router;