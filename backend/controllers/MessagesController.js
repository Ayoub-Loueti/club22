const Employe = require('../models/EmployeModel');
const Utilisateur = require('../models/UtilisateurModel');
const Message = require('../models/MessagesModel');

exports.createMessage = async (req, res) => {
    try {
        const userId = req.userId;
        const { contenu } = req.body;

        const isEmploye = await Utilisateur.findOne({
            where: {
                id_utilisateur: userId,
                type: 'employe',
            },
        });

        if (!isEmploye) {
            return res.status(403).json({
                error: 'Permission denied. Only employees can create requests.',
            });
        }

        const employe = await Employe.findOne({
            where: { id_utilisateur: userId },
        });

        if (!employe) {
            return res.status(404).json({ error: 'Employee not found' });
        }
       

            const message = await Message.create({
              id_employe: employe.id_employe,
             contenu: contenu,
            });

            return res.status(201).json({ message });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Message.findAll({
            include: [{
                model: Employe,
                as: 'employe',
                include :[{
                model: Utilisateur,
                as: 'utilisateur',
                }]
            }],
        });
        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = exports;
