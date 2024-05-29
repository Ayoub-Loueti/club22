const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/MessagesController');
const authenticate = require('../middleware/authenticate');

router.post('/message/:id_disc', authenticate, messagesController.createMessage);
router.get('/messages/:id_disc',authenticate, messagesController.getMessages);

router.post('/discussions',authenticate, messagesController.createDiscussion);
router.get('/discussions', authenticate,messagesController.getAllDiscussions);

router.get('/users/employes-admins', authenticate, messagesController.findEmployesAndAdmins);
router.get('/discussion/:id_disc/members', authenticate, messagesController.getDiscussionMembers);
router.get('/discussion/:id_disc/is-private', authenticate, messagesController.checkIfDiscussionIsPrivate);

router.get('/discussion/:id_disc/is-admin',authenticate, messagesController.checkIfUserIsAdmin);
router.delete('/discussion/:id_disc/member/:userId', authenticate, messagesController.deleteMemberFromDiscussion);

router.post('/chatbot', authenticate, messagesController.handleChatbotInteraction);

module.exports = router;