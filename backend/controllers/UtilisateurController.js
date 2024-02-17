const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = 'ayoub';
const Utilisateur = require('../models/UtilisateurModel'); 


exports.signup = async (req, res) => {
    const { nom, prenom, email, motDePasse, genre, photo, type , etat} = req.body;
  
    try {
      const existingUser = await Utilisateur.findOne({ where: { email: email } });
  
      if (existingUser) {
        res.status(400).json({ error: 'User with this email already exists' });
      } else {

        const hashedPassword = await bcrypt.hash(motDePasse, 10);
  
        const newUser = await Utilisateur.create({
          nom,
          prenom,
          email,
          motDePasse: hashedPassword,
          genre,
          photo,
          type,
          etat,
        });
  
        const token = jwt.sign({ userId: newUser.id_utilisateur }, secretKey, {
          expiresIn: '1h',
        });
  
        res.status(201).json({
          message: 'User registered successfully',
          user: newUser,
          token: token,
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.login = async (req, res) => {
    const { email, motDePasse } = req.body;

    try {
        const user = await Utilisateur.findOne({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ error: 'utilisateur non trouvee' });
        }

        if (user.etat !== 'autorise') {
            return res.status(403).json({ error: 'User account is not authorized to log in' });
        }

        const passwordMatch = await bcrypt.compare(motDePasse, user.motDePasse);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = jwt.sign({ userId: user.id_utilisateur }, secretKey, {
            expiresIn: '1h',
        });

        res.status(200).json({
            message: 'Login successful',
            user: user,
            token: token,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
  const userId = req.userId; 

  try {
    const userToUpdate = await Utilisateur.findByPk(userId);

    if (!userToUpdate) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    await Utilisateur.update(req.body, {
      where: { id_utilisateur: userId },
    });

    res.status(200).json({ message: 'Informations mises à jour avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.findUser = async (req, res) => {
  const requestedUserId = req.params.id;
  const authenticatedUserId = req.userId;

  try {
    if (requestedUserId === authenticatedUserId.toString()) { 
      return res.status(403).json({ error: "vous pouvez pas recherche ton compte" });
    }

    const user = await Utilisateur.findOne({
      where: { id_utilisateur: requestedUserId },
    });

    if (!user) {
      return res.status(404).json({ error: "utilisateur non trouvee" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



  module.exports = exports;