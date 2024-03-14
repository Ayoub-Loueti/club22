const Notification = require('../models/NotificationModel');
const Utilisateur = require('../models/UtilisateurModel');
const Post = require('../models/PostModel');

exports.getNotificationsForUser = async (req, res) => {
    const userId = req.userId; // Assuming this is set from your authentication middleware

    try {
        const notifications = await Notification.findAll({
            where: { id_own_post: userId },
            include: [
                {
                    model: Utilisateur,
                    as: 'utilisateur',
                    attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
                },
                {
                    model: Post,
                    as: 'post',
                    attributes: ['id_post', 'contenu'],
                }
            ],
            order: [['date_notif', 'DESC']]
        });

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};

exports.updateNotificationStatus = async (req, res) => {
    const { notificationId } = req.params; // Assuming you're passing the notification ID in the URL
    const { isRead } = req.body; // Assuming you're passing the new status in the request body

    try {
        const notification = await Notification.findByPk(notificationId);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await notification.update({ isRead });

        return res.status(200).json({ message: 'Notification status updated successfully', notification });
    } catch (error) {
        console.error('Error updating notification status:', error);
        return res.status(500).json({ message: 'Error updating notification status', error });
    }
};

exports.getUserNotificationCount = async (req, res) => {
    const userId = req.userId; // Assuming req.userId holds the ID of the currently authenticated user

    try {
        const user = await Utilisateur.findByPk(userId, {
            attributes: ['nbr_notifs'] // Fetch only the 'nbr_notifs' field
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ nbr_notifs: user.nbr_notifs });
    } catch (error) {
        console.error('Error retrieving user notification count:', error);
        return res.status(500).json({ message: 'Error retrieving user notification count', error: error.message });
    }
};

exports.resetUserNotificationCount = async (req, res) => {
    const userId = req.userId; // Assuming req.userId holds the ID of the currently authenticated user

    try {
        const user = await Utilisateur.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ nbr_notifs: 0 });

        return res.status(200).json({ message: 'Notification count reset successfully' });
    } catch (error) {
        console.error('Error resetting user notification count:', error);
        return res.status(500).json({ message: 'Error resetting user notification count', error: error.message });
    }
};

module.exports = exports;