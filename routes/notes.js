const router = require('express').Router();
const { get, create } = require('../app/controller/notesController');
const { authenticateToken } = require('../app/middleware/authMiddleware');

router.post('/get', get);
router.post('/create', create);

module.exports = router;