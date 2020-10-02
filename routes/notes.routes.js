const router = require('express').Router();
const { getNotes, createNote, deleteNote } = require('../app/controller/notes.controller');
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;

router.get('/:lead_id', authenticateToken, getNotes);
router.post('/create', authenticateToken, createNote);
router.delete('/:note_id', authenticateToken, deleteNote);

module.exports = router;