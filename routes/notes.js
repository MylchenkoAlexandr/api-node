const router = require('express').Router();
const { getNotes, createNote, deleteNote } = require('../app/controller/notesController');
const { authenticateToken } = require('../app/middleware/authMiddleware');

router.post('/get', getNotes);
router.post('/create', createNote);
router.post('/delete', deleteNote);

module.exports = router;