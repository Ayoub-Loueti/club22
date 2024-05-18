const Employe = require('../models/EmployeModel');
const Utilisateur = require('../models/UtilisateurModel');
const Message = require('../models/MessagesModel');
const Discussion = require('../models/DiscussionModel');

exports.createMessage = async (req, res) => {
    try {
        const userId = req.userId; // id_utilisateur from req.userId
        const { contenu } = req.body; // contenu from body
        const { id_disc } = req.params; // id_disc from path

        const utilisateur = await Utilisateur.findOne({
            where: { id_utilisateur: userId },
        });

        if (!utilisateur) {
            return res.status(404).json({ error: 'User not found' });
        }

        const discussion = await Discussion.findOne({
            where: { id_disc: id_disc },
        });

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        const message = await Message.create({
            id_utilisateur: userId,
            id_disc: id_disc,
            contenu: contenu,
        });

        const fullMessage = await Message.findOne({
            where: { id_msg: message.id_msg },
            include: [{
                model: Utilisateur,
                as: 'utilisateur',
                attributes: ['nom', 'prenom', 'photo']
            }]
        });

        return res.status(201).json(fullMessage);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { id_disc } = req.params; // Get id_disc from path

        const messages = await Message.findAll({
            where: { id_disc: id_disc },
            include: [{
                model: Utilisateur,
                as: 'utilisateur',
                attributes: ['nom', 'prenom', 'photo']
            }],
        });

        if (!messages.length) { // Check if the messages array is empty
            return res.status(404).json({ error: 'No messages found for this discussion' });
        }

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.createDiscussion = async (req, res) => {
    const { nomDisc, nbr_jours_disc } = req.body;
    
    try {
        const currentDate = new Date();
        const daysToAdd = parseInt(nbr_jours_disc, 10);
        currentDate.setDate(currentDate.getDate() + daysToAdd);
        const newDiscussion = await Discussion.create({
            nomDisc,
            typeDisc: "temporaire",
            nbr_jours_disc,
            date_fin: currentDate
        });

        req.app.get('io').emit('new discussion', newDiscussion);

        res.status(201).json(newDiscussion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.findAll({});
        res.status(200).json(discussions);
    } catch (error) {
        console.error('Error fetching discussions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = exports;
