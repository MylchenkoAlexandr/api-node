const router = require('express').Router();
const { getNotes, createNote, deleteNote } = require('../app/controller/notes.controller');
const AuthMiddleware = require('../app/middleware/auth.middleware');
const authenticateToken = AuthMiddleware.authenticateToken;

router.post('/get', authenticateToken, getNotes);
router.post('/create', authenticateToken, createNote);
router.post('/delete', authenticateToken, deleteNote);

module.exports = router;