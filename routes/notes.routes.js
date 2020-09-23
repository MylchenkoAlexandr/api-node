const router = require('express').Router();
const { getNotes, createNote, deleteNote } = require('../app/controller/notes.controller');
const { authenticateToken } = require('../app/middleware/auth.middleware');

router.post('/get', authenticateToken, getNotes);
router.post('/create', authenticateToken, createNote);
router.post('/delete', authenticateToken, deleteNote);

module.exports = router;