const router = require('express').Router();
const { createBeneficiary, getBeneficiary } = require('../app/controller/beneficiaryController');

router.post('/create', createBeneficiary);
router.get('/get/:lead_id', getBeneficiary);

module.exports = router;