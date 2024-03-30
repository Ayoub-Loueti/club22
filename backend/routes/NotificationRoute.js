const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');
const authenticate = require('../middleware/authenticate');

router.get('/notifications', authenticate, notificationController.getNotificationsForUser);
router.patch('/notifications/:notificationId', authenticate, notificationController.updateNotificationStatus);
router.get('/user-notifications',authenticate, notificationController.getUserNotificationCount);
router.post('/reset-notifications', authenticate, notificationController.resetUserNotificationCount);
router.delete('/notifications/:notificationId',authenticate,notificationController.deleteNotification);

module.exports = router;
