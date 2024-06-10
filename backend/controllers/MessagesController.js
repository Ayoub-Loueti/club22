const Employe = require('../models/EmployeModel');
const Utilisateur = require('../models/UtilisateurModel');
const Message = require('../models/MessagesModel');
const MembreModel = require('../models/MembreModel');
const { Sequelize } = require('sequelize'); 
const { sequelize } = require('../config/db'); 
const Discussion = require('../models/DiscussionModel');
     const {
       GoogleGenerativeAI,
       HarmCategory,
       HarmBlockThreshold,
     } = require('@google/generative-ai');
     
exports.createMessage = async (req, res) => {
    try {
        const userId = req.userId; 
        const { contenu } = req.body; 
        const { id_disc } = req.params; 

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
        const { id_disc } = req.params; 

        const messages = await Message.findAll({
            where: { id_disc: id_disc },
            include: [{
                model: Utilisateur,
                as: 'utilisateur',
                attributes: ['nom', 'prenom', 'photo']
            }],
        });

        if (!messages.length) { 
            return res.status(404).json({ error: 'No messages found for this discussion' });
        }

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.findEmployesAndAdmins = async (req, res) => {
  const currentUserId = req.userId; 

  try {
      const employees = await Employe.findAll({
          where: {
              adherant: true 
          },
          include: [{
              model: Utilisateur,
              as: 'utilisateur', 
              where: {
                  [Sequelize.Op.and]: [
                      { id_utilisateur: { [Sequelize.Op.ne]: currentUserId } }, 
                      { etat: 'autorise' },
                      { type: 'employe' } 
                  ]
              },
              attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'photo', 'type']
          }]
      });

      const admins = await Utilisateur.findAll({
          where: {
              [Sequelize.Op.and]: [
                  { id_utilisateur: { [Sequelize.Op.ne]: currentUserId } },
                  { etat: 'autorise' },
                  { type: 'admin' }
              ]
          },
          attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'photo', 'type']
      });

      const results = [...employees.map(emp => emp.utilisateur), ...admins];

      if (results.length === 0) {
          return res.status(404).json({ message: 'No matching users found.' });
      }

      return res.status(200).json(results);
  } catch (error) {
      console.error('Error searching for employes and admins:', error);
      return res.status(500).json({ error: error.message });
  }
};

exports.createDiscussion = async (req, res) => {
    const { nomDisc, nbr_jours_disc, namedUsers, ispublic } = req.body;
    const userId = req.userId; 
  
    try {
        const currentDate = new Date();
        const daysToAdd = parseInt(nbr_jours_disc, 10);
        currentDate.setDate(currentDate.getDate() + daysToAdd);
  
        const newDiscussion = await Discussion.create({
            nomDisc,
            typeDisc: "temporaire",
            nbr_jours_disc,
            date_fin: currentDate,
            ispublic,
        });
  
        req.app.get('io').emit('new discussion', newDiscussion);
  
        let allUserIds = [userId]; // This will include the creator's ID first
        if (Array.isArray(namedUsers)) {
            allUserIds = allUserIds.concat(namedUsers); 
        }
  
        allUserIds = [...new Set(allUserIds)]; // Ensure no duplicates
  
        await Promise.all(allUserIds.map((id, index) => 
            MembreModel.create({
                id_discussion: newDiscussion.id_disc,
                id_utilisateur: id,
                isAdmin: id === userId // Set isAdmin true only for the creator
            })
        ));
  
        res.status(201).json(newDiscussion);
    } catch (error) {
        console.error('Error creating discussion:', error);
        res.status(500).json({ error: error.message });
    }
  };

exports.getAllDiscussions = async (req, res) => {
  const userId = req.userId;

  try {
      const memberDiscussions = await MembreModel.findAll({
          where: { id_utilisateur: userId },
          include: [{
              model: Discussion,
              as: 'discussion',
              required: true
          }]
      });

      const publicDiscussions = await Discussion.findAll({
          where: { ispublic: true }
      });

      const discussionsFromMembers = memberDiscussions.map(membre => membre.discussion);

      const allDiscussions = [ ...publicDiscussions,...discussionsFromMembers];
      const uniqueDiscussions = Array.from(new Set(allDiscussions.map(disc => disc.id_disc)))
          .map(id => {
              return allDiscussions.find(disc => disc.id_disc === id);
          });

      if (uniqueDiscussions.length === 0) {
          return res.status(404).json({ message: 'No discussions found.' });
      }

      res.status(200).json(uniqueDiscussions);
  } catch (error) {
      console.error('Error fetching discussions:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.getDiscussionMembers = async (req, res) => {
    const { id_disc } = req.params; 
    try {
        const discussion = await Discussion.findOne({
            where: {
                id_disc: id_disc,
                ispublic: false 
            }
        });

        if (!discussion) {
            return res.status(404).json({ error: 'Private discussion not found.' });
        }

        const members = await MembreModel.findAll({
            where: { id_discussion: id_disc },
            include: [{
                model: Utilisateur,
                as: 'utilisateur',
                attributes: ['id_utilisateur', 'nom', 'prenom', 'email','photo'] 
            }]
        });

        if (!members.length) {
            return res.status(404).json({ error: 'No members found for this discussion.' });
        }

        res.status(200).json(members);
    } catch (error) {
        console.error('Error fetching discussion members:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.checkIfDiscussionIsPrivate = async (req, res) => {
    const { id_disc } = req.params; 

    try {
        const discussion = await Discussion.findOne({
            where: { id_disc: id_disc },
            attributes: ['id_disc', 'ispublic'] 
        });

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found.' });
        }

        const isPrivate = !discussion.ispublic;

        res.status(200).json({ id_disc: discussion.id_disc, isPrivate: isPrivate });
    } catch (error) {
        console.error('Error checking if discussion is private:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.checkIfUserIsAdmin = async (req, res) => {
    const userId = req.userId; 
    const { id_disc } = req.params;

    try {
        const member = await MembreModel.findOne({
            where: {
                id_utilisateur: userId,
                id_discussion: id_disc
            },
            attributes: ['isAdmin']
        });

        if (!member) {
            return res.status(404).json({ message: 'Member not found in the discussion.' });
        }

        res.status(200).json({ isAdmin: member.isAdmin });
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.deleteMemberFromDiscussion = async (req, res) => {
    const { userId } = req.params; 
    const { id_disc } = req.params; 

    try {
        

        const result = await MembreModel.destroy({
            where: {
                id_membre: userId,
                id_discussion: id_disc
            }
        });

        if (result === 0) {
            return res.status(404).json({ message: 'Member not found or already removed.' });
        }

        res.status(200).json({ message: 'Member removed successfully.' });
    } catch (error) {
        console.error('Error removing member from discussion:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const apiKey ="AIzaSyCNG3ZPYzEW_V4m0Vz2Onq5BceRJ_1cAtg";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

exports.handleChatbotInteraction = async (req, res) => {
    try {
      const inputText = req.body.inputText;
      const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [
          {
            role: "user",
            parts: [
              {text: "Bonjour! vous etes Cluby, un assistant amical qui travaille pour Club22 Ooredoo. Club22 est un site web qui permet au grand public de partager leurs expériences et d'exprimer leurs opinions grâce à ses astuces spéciales. Pour les employés, ils peuvent réserver des offres en collaboration avec la société Ooredoo.\n\nOoredoo est une entreprise de télécommunications en Tunisie qui offre une gamme de services, notamment la téléphonie mobile, les services de données et l'Internet. Leur vision est d'enrichir la vie digitale de leurs clients et de stimuler la croissance humaine grâce à leurs services. \nPrésentation générale :\n\nOoredoo Tunisie est un acteur majeur dans le domaine des télécommunications en Tunisie, offrant une gamme de services comprenant la téléphonie mobile, les services de données et l'Internet .\nCouverture et réseau :\n\nOoredoo dispose d'un réseau technique performant qui couvre 99% de la population tunisienne. Cela inclut une vaste gamme de services et un réseau de boutiques réparties à travers le pays .\nVision et mission :\n\nLa vision de l'entreprise est d'enrichir la vie digitale de ses clients. Ooredoo croit en son potentiel à stimuler la croissance humaine grâce à ses services .\nGouvernance :\n\nLe directeur général de l'entreprise est Mansoor Rashid Al Khater, et le président du conseil d'administration est Waleed Mohamed Al-Sayed. Ooredoo est majoritairement détenue par Ooredoo (90%) avec une participation de l'État tunisien (10%) .\nServices et promotions :\n\nOoredoo propose diverses promotions et exclusivités disponibles via l'application My Ooredoo. L'entreprise met également à disposition un widget pour vérifier les soldes et d'autres services pratiques pour les utilisateurs .\nne repondre que les question relier a ooredoo et les des bons plan / actitivite / voyages \nne  réponds à rien qui ne soit pas dans ce contexte.\nOoredoo Shop website : https://www.ooredoo.tn/Personal/fr/accueil\nOoredoo youtube channel : \nhttps://www.youtube.com/@ooredootn\nOoredo instagram account is : \nhttps://www.instagram.com/ooredootn/\nOoredoo tiktok account is : \nhttps://www.tiktok.com/@ooredoo.tn\nOoredoo facebook account is : \nhttps://www.facebook.com/ooredootn\nEncourage l'utilisateur de visiter le channel youtube et les sociaux media comptes "},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "Salut! 👋  J'ai l'impression que tu cherches des bons plans ou des activités sympas en Tunisie ?  Ooredoo est là pour t'aider à profiter au maximum de ton temps libre !  \n\nN'hésite pas à me poser des questions sur les promotions et offres spéciales d'Ooredoo. \n\nPour ne rien manquer des dernières offres, des activités et des voyages proposés par Ooredoo, abonne-toi à notre chaîne YouTube et suis-nous sur nos réseaux sociaux :\n\n* **YouTube :** [https://www.youtube.com/@ooredootn](https://www.youtube.com/@ooredootn)\n* **Instagram :** [https://www.instagram.com/ooredootn/](https://www.instagram.com/ooredootn/)\n* **TikTok :** [https://www.tiktok.com/@ooredoo.tn](https://www.tiktok.com/@ooredoo.tn)\n* **Facebook :** [https://www.facebook.com/ooredootn](https://www.facebook.com/ooredootn)\n\nJ'attends de tes nouvelles ! 😉 \n"},
            ],
          },
        ],
      });
  
      const result = await chatSession.sendMessage(inputText);
      res.status(200).json({ response: result.response.text() });
    } catch (error) {
      console.error('Error with chatbot interaction:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  };
module.exports = exports;
