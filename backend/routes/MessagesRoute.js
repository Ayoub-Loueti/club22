const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/MessagesController');
const authenticate = require('../middleware/authenticate');

router.post('/message/:id_disc', authenticate, messagesController.createMessage);
router.get('/messages/:id_disc',authenticate, messagesController.getMessages);

router.post('/discussions',authenticate, messagesController.createDiscussion);
router.get('/discussions', authenticate,messagesController.getAllDiscussions);

module.exports = router;