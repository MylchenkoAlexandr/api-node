const router = require('express').Router();
const { getNotes, createNote, deleteNote } = require('../app/controller/notesController');
const { authenticateToken } = require('../app/middleware/authMiddleware');

router.post('/get', authenticateToken, getNotes);
router.post('/create', authenticateToken, createNote);
router.post('/delete', authenticateToken, deleteNote);

module.exports = router;