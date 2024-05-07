const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/MessagesController');
const authenticate = require('../middleware/authenticate');

router.post('/message', authenticate, messagesController.createMessage);
router.get('/messages', authenticate, messagesController.getAllMessages);

module.exports = router;