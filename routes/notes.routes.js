const router = require('express').Router();
const NotesController = require('../app/controller/notes.controller');
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;

router.get('/:lead_id', authenticateToken, NotesController.getNotes);
router.post('/create', authenticateToken, NotesController.createNote);
router.delete('/:note_id', authenticateToken, NotesController.deleteNote);

module.exports = router;