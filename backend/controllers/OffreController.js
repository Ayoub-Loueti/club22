const Utilisateur = require('../models/UtilisateurModel');
const OffreModel = require('../models/OffreModel');
const CollaborateurModel = require('../models/CollaborateurModel');
const ImageOffre = require('../models/ImageOffreModel');
const multiImageUpload = require('../middleware/multiImageUpload');
const ActiviteModel = require('../models/ActiviteModel');
const VoyageModel = require('../models/VoyageModel');
const GrandHotelModel = require('../models/GrandHotelModel');
const Evaluation = require('../models/EvaluationModel');
const TypeChambreModel = require('../models/TypeChambreModel');
const GrandHotelTypeChambres = require('../models/GrandHotelTypeChambres');

exports.getOfferImages = async (req, res) => {
  const { offreId } = req.params;
  try {
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId,
        type: 'admin',
      },
    });
    if (!isAdmin) {
      return res.status(403).json({
        error:
          'Permission denied. Only administrators can access offer images.',
      });
    }

    const images = await ImageOffre.findAll({
      where: { id_offre: offreId },
      attributes: ['image'], // Ensure this is the correct field name in your model
    });

    if (!images.length) {
      return res
        .status(404)
        .json({ message: 'No images found for this offer' });
    }

    res.status(200).json(images.map((img) => img.image)); // Modify as necessary to match your file path handling
  } catch (error) {
    console.error('Failed to get offer images:', error);
    res.status(500).json({ error: 'Failed to retrieve offer images' });
  }
};

exports.createOffre = async (req, res) => {
  try {
    const isAdmin = await Utilisateur.findOne({
      where: { id_utilisateur: req.userId, type: 'admin' },
    });

    if (!isAdmin) {
      return res.status(403).json({
        error:
          'Permission denied. Only administrators can perform this action.',
      });
    }

    const {
      titre,
      description,
      date_debut,
      date_fin,
      prix,
      id_collaborateur,
      type,
      remise,
      destination,
      nombre_enfants_gratuits,
      age_limite_gratuite,
      prix_enfants_payants,
      conditions_speciales_enfants,
      enfants_autorises,

      // Additional fields for specific types
      nom_hotel,
      etoiles,
      climatisation,
      wifi,
      piscine_exterieure,
      piscine_couverte,
      bassin_enfants,
      parking,
      discotheque,
      plage_privee,
      ascenseur,
      salle_de_sport,
      aire_de_jeux_enfants,
      programme,
      inclus,
      nbr_jours,
      duree,
      spa,
      sauna,
      hammam,
      thalasso,
      centre_esthetique,
      toboggan,
      pieds_dans_l_eau,
      piscine_eau_de_mer,
      baby_setting,
      tennis_de_table,
      location_de_voiture,
      change_monetaire,

      
    } = req.body;

    const offre = await OffreModel.create({
      titre,
      description,
      nombre_enfants_gratuits,
      age_limite_gratuite,
      prix_enfants_payants,
      conditions_speciales_enfants,
      enfants_autorises,
      date_debut,
      date_fin,
      prix,
      id_collaborateur,
      type,
      remise,
      destination,
    });

    if (req.files && req.files.length > 0) {
      const imageUploads = req.files.map((file) => {
        const imagePath = file.path; // Assumes path handling is already set
        return ImageOffre.create({
          image: imagePath,
          id_offre: offre.id_offre,
        });
      });
      await Promise.all(imageUploads);
    }

    // Create specific type details based on offre type
    switch (type) {
      case 'hotel':{
     ho=   await GrandHotelModel.create({
          id_offre: offre.id_offre,
          nom_hotel,
          etoiles,
          climatisation,
          wifi,
          piscine_exterieure,
          piscine_couverte,
          bassin_enfants,
          parking,
          discotheque,
          plage_privee,
          ascenseur,
          salle_de_sport,
          aire_de_jeux_enfants,
          spa,
          sauna,
          hammam,
          thalasso,
          centre_esthetique,
          toboggan,
          pieds_dans_l_eau,
          piscine_eau_de_mer,
          baby_setting,
          tennis_de_table,
          location_de_voiture,
          change_monetaire,
        });


        break;  }
      case 'voyage':
        await VoyageModel.create({
          id_offre: offre.id_offre,
          programme,
          inclus,
          nbr_jours,
         
        });
        break;
      case 'activite':
        await ActiviteModel.create({
          id_offre: offre.id_offre,
          programme,
          inclus,
          duree,
       
        });
        break;
    }

    res.status(201).json({ message: 'Offre created successfully', offre });
  } catch (error) {
    console.error('Error creating offre:', error);
    res
      .status(500)
      .json({ error: 'Failed to create offre', details: error.message });
  }
};

// Updating an offer, including specific details based on the offer type
exports.updateOffre = async (req, res) => {
  const { offreId } = req.params;
  try {
    const isAdmin = await Utilisateur.findOne({
      where: { id_utilisateur: req.userId, type: 'admin' },
    });

    if (!isAdmin) {
      return res.status(403).json({
        error:
          'Permission denied. Only administrators can perform this action.',
      });
    }

    const offre = await OffreModel.findByPk(offreId);
    if (!offre) {
      return res.status(404).json({ error: 'Offre not found' });
    }

    // Basic info update
    const updateData = {
      titre: req.body.titre,
      description: req.body.description,
      nombre_enfants_gratuits: req.body.nombre_enfants_gratuits,
      age_limite_gratuite: req.body.age_limite_gratuite,
      prix_enfants_payants: req.body.prix_enfants_payants,
      enfants_autorises:req.body.enfants_autorises,
      conditions_speciales_enfants: req.body.conditions_speciales_enfants,
      prix: req.body.prix,
      date_debut: req.body.date_debut,
      date_fin: req.body.date_fin,
      id_collaborateur: req.body.id_collaborateur,
      type: req.body.type,
      remise: req.body.remise,
      destination: req.body.destination,
    };
    await offre.update(updateData);

    // Update specific type details
    switch (offre.type) {
      case 'hotel':
        const hotelDetails = {
          nom_hotel: req.body.nom_hotel,
          etoiles: req.body.etoiles,
          climatisation: req.body.climatisation,
          wifi: req.body.wifi,
          piscine_exterieure: req.body.piscine_exterieure,
          piscine_couverte: req.body.piscine_couverte,
          bassin_enfants: req.body.bassin_enfants,
          parking: req.body.parking,
          discotheque: req.body.discotheque,
          plage_privee: req.body.plage_privee,
          ascenseur: req.body.ascenseur,
          salle_de_sport: req.body.salle_de_sport,
          aire_de_jeux_enfants: req.body.aire_de_jeux_enfants,
          spa: req.body.spa,
          sauna: req.body.sauna,
          hammam: req.body.hammam,
          thalasso: req.body.thalasso,
          centre_esthetique: req.body.centre_esthetique,
          toboggan: req.body.toboggan,
          pieds_dans_l_eau: req.body.pieds_dans_l_eau,
          piscine_eau_de_mer: req.body.piscine_eau_de_mer,
          baby_setting: req.body.baby_setting,
          tennis_de_table: req.body.tennis_de_table,
          location_de_voiture: req.body.location_de_voiture,
          change_monetaire: req.body.change_monetaire,
        };
        await GrandHotelModel.update(hotelDetails, {
          where: { id_offre: offreId },
        });
        break;
      case 'voyage':
        const voyageDetails = {
          programme: req.body.programme,
          inclus: req.body.inclus,
          nbr_jours: req.body.nbr_jours,
       
        };
        await VoyageModel.update(voyageDetails, {
          where: { id_offre: offreId },
        });
        break;
      case 'activite':
        const activiteDetails = {
          programme: req.body.programme,
          inclus: req.body.inclus,
          duree: req.body.duree,
     
        };
        await ActiviteModel.update(activiteDetails, {
          where: { id_offre: offreId },
        });
        break;
    }
  if (req.files && req.files.length > 0) {
    const existingImages = await ImageOffre.findAll({
      where: { id_offre: offreId },
    });
    const deletions = existingImages.map((img) => img.destroy());
    await Promise.all(deletions);

    const imageUploads = req.files.map((file) => {
      const imagePath = file.path; // Assumes path handling is already set
      return ImageOffre.create({ image: imagePath, id_offre: offre.id_offre });
    });
    await Promise.all(imageUploads);
  }

    res.status(200).json({ message: 'Offre updated successfully', data: offre });
  } catch (error) {
    console.error('Update failed:', error);
    res
      .status(500)
      .json({ error: 'Failed to update offre', details: error.message });
  }
};

exports.deleteOffre = async (req, res) => {
  const { offreId } = req.params;
  try {
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId,
        type: 'admin',
      },
    });

    if (!isAdmin) {
      return res.status(403).json({
        error:
          'Permission denied. Only administrators can perform this action.',
      });
    }

    // Check if the offer exists
    const offreToDelete = await OffreModel.findByPk(offreId);
    if (!offreToDelete) {
      return res.status(404).json({ error: 'Offre not found' });
    }

    // Delete the offer using the correct column name (assuming it's id_offre)
    await OffreModel.destroy({ where: { id_offre: offreId } });
    res.status(200).json({ message: 'Offre deleted successfully' });
  } catch (error) {
    console.error('Failed to delete offre:', error);
    res.status(500).json({ error: 'Failed to delete offre' });
  }
};

exports.getAllOffres = async (req, res) => {
  try {
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId,
        type: 'admin',
      },
    });

    if (!isAdmin) {
      return res.status(403).json({
        error:
          'Permission denied. Only administrators can perform this action.',
      });
    }

    const offres = await OffreModel.findAll({
      include: [
        {
          model: CollaborateurModel,
          as: 'collaborateur',
          attributes: ['nom', 'logo'],
        },
      ],
      attributes: { exclude: ['created_at', 'updated_at'] },
    });

    if (!offres.length) {
      return res.status(404).json({ message: 'No offres found' });
    }

    // Dynamically fetch details based on the offre type
    const offreDetails = await Promise.all(
      offres.map(async (offre) => {
        const offreJson = offre.toJSON();
        offreJson.lesImages = await ImageOffre.findAll({
          where: { id_offre: offre.id_offre },
        });

        const evaluations = await Evaluation.findAll({
          where: { id_offre: offre.id_offre },
        });
        const totalVotes = evaluations.reduce(
          (sum, evaluation) => sum + evaluation.vote,
          0
        );
        const numberOfEvaluations = evaluations.length;
        offreJson.evaluation = {
          averageVotes:
            numberOfEvaluations > 0
              ? (totalVotes / numberOfEvaluations).toFixed(2)
              : 0,
          totalVotes: totalVotes,
          numberOfEvaluations: numberOfEvaluations,
        };

        switch (offre.type) {
          case 'hotel':
            offreJson.details = await GrandHotelModel.findOne({
              where: { id_offre: offre.id_offre },
            });
            break;
          case 'voyage':
            offreJson.details = await VoyageModel.findOne({
              where: { id_offre: offre.id_offre },
            });
            break;
          case 'activite':
            offreJson.details = await ActiviteModel.findOne({
              where: { id_offre: offre.id_offre },
            });
            break;
        }

        return offreJson;
      })
    );

    res.status(200).json(offreDetails);
  } catch (error) {
    console.error('Failed to get offres:', error);
    res.status(500).json({ error: 'Failed to get offres' });
  }
};

exports.getOffreById = async (req, res) => {
  const { offreId } = req.params;
  try {
    // Vérification des droits d'administrateur
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId,
        type: 'admin',
      },
    });

    if (!isAdmin) {
      return res.status(403).json({
        error:
          'Permission denied. Only administrators can perform this action.',
      });
    }

    // Récupération de l'offre avec les détails du collaborateur
    const offre = await OffreModel.findByPk(offreId, {
      include: [
        {
          model: CollaborateurModel,
          as: 'collaborateur',
          attributes: ['nom', 'logo'],
        },
      ],
    });

    if (!offre) {
      return res.status(404).json({ error: 'Offre not found' });
    }

    // Récupération des images associées à l'offre
    const images = await ImageOffre.findAll({
      where: { id_offre: offre.id_offre },
    });

    // Préparation de la réponse avec les images
    const offreDetail = { ...offre.toJSON(), lesImages: images };

    // Ajout des détails supplémentaires basés sur le type de l'offre
    switch (offre.type) {
      case 'hotel':
        offreDetail.details = await GrandHotelModel.findOne({
          where: { id_offre: offre.id_offre },
        });
        break;
      case 'voyage':
        offreDetail.details = await VoyageModel.findOne({
          where: { id_offre: offre.id_offre },
        });
        break;
      case 'activite':
        offreDetail.details = await ActiviteModel.findOne({
          where: { id_offre: offre.id_offre },
        });
        break;
    }

    // Envoi de la réponse complète
    res.status(200).json(offreDetail);
  } catch (error) {
    console.error('Failed to get offre:', error);
    res
      .status(500)
      .json({ error: 'Failed to get offre', details: error.message });
  }
};

exports.getAllEmployeeOffers = async (req, res) => {
  try {
    const isEmployee = await Utilisateur.findOne({
      where: { id_utilisateur: req.userId, type: 'employe' },
    });

    if (!isEmployee) {
      return res.status(403).json({
        error: 'Permission denied. Only employees can perform this action.',
      });
    }

    let offres = await OffreModel.findAll({
      include: [
        {
          model: CollaborateurModel,
          as: 'collaborateur',
          attributes: ['nom', 'logo'],
        },
      ],
      attributes: { exclude: ['created_at', 'updated_at'] },
    });

    const detailedOffres = await Promise.all(
      offres.map(async (offre) => {
        const offreJson = offre.toJSON();
        offreJson.lesImages = await ImageOffre.findAll({
          where: { id_offre: offre.id_offre },
        });

        // Fetch evaluations and calculate average votes, nested under "evaluation"
        const evaluations = await Evaluation.findAll({
          where: { id_offre: offre.id_offre },
        });
        const totalVotes = evaluations.reduce(
          (sum, evaluation) => sum + evaluation.vote,
          0
        );
        const numberOfEvaluations = evaluations.length;
        offreJson.evaluation = {
          averageVotes:
            numberOfEvaluations > 0
              ? (totalVotes / numberOfEvaluations).toFixed(2)
              : 0,
          totalVotes: totalVotes,
          numberOfEvaluations: numberOfEvaluations,
        };

        // Dynamically include details based on the type of offre
        switch (offre.type) {
          case 'hotel':
            offreJson.details = await GrandHotelModel.findOne({
              where: { id_offre: offre.id_offre },
            });
            break;
          case 'voyage':
            offreJson.details = await VoyageModel.findOne({
              where: { id_offre: offre.id_offre },
            });
            break;
          case 'activite':
            offreJson.details = await ActiviteModel.findOne({
              where: { id_offre: offre.id_offre },
            });
            break;
        }

        return offreJson;
      })
    );

    if (!detailedOffres.length) {
      return res.status(404).json({ message: 'No offers found' });
    }

    res.status(200).json(detailedOffres);
  } catch (error) {
    console.error('Failed to get offers:', error);
    res.status(500).json({ error: 'Failed to get offers' });
  }
};


exports.getEmployeeOfferById = async (req, res) => {
  const { offreId } = req.params;
  try {
    const isEmployee = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId,
        type: 'employe',
      },
    });

    if (!isEmployee) {
      return res.status(403).json({
        error: 'Permission denied. Only employees can perform this action.',
      });
    }

    const offre = await OffreModel.findByPk(offreId);
    if (!offre) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    const images = await ImageOffre.findAll({
      where: {
        id_offre: offre.id_offre,
      },
    });
    const offreDetail = offre.toJSON();
    offreDetail.lesImages = images;

    // Fetch and include details based on the type of the offer
    switch (offre.type) {
      case 'hotel':
        offreDetail.details = await GrandHotelModel.findOne({
          where: { id_offre: offre.id_offre },
        });
        break;
      case 'voyage':
        offreDetail.details = await VoyageModel.findOne({
          where: { id_offre: offre.id_offre },
        });
        break;
      case 'activite':
        offreDetail.details = await ActiviteModel.findOne({
          where: { id_offre: offre.id_offre },
        });
        break;
    }

    res.status(200).json(offreDetail);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get offer' });
  }
};


exports.getAllOffresCollab = async (req, res) => {
  try {
    const { collabId } = req.params;

    const offres = await OffreModel.findAll({
      include: {
        model: CollaborateurModel,
        as: 'collaborateur',
        where: { id_collaborateur: collabId }, // Filter by collaborator ID
        attributes: ['nom', 'logo'],
      },
      attributes: { exclude: ['created_at', 'updated_at'] }, // Exclude timestamps from OffreModel
    });

    if (!offres.length) {
      return res
        .status(204)
        .json({ message: 'No offres found for the collaborator' });
    }

    const offreDetails = await Promise.all(
      offres.map(async (offre) => {
        const offreJson = offre.toJSON();

        const images = await ImageOffre.findAll({
          where: {
            id_offre: offre.id_offre,
          },
        });
        offreJson.lesImages = images;
        const evaluations = await Evaluation.findAll({
          where: { id_offre: offre.id_offre },
        });
        const totalVotes = evaluations.reduce(
          (sum, evaluation) => sum + evaluation.vote,
          0
        );
        const numberOfEvaluations = evaluations.length;
        offreJson.evaluation = {
          averageVotes:
            numberOfEvaluations > 0
              ? (totalVotes / numberOfEvaluations).toFixed(2)
              : 0,
          totalVotes: totalVotes,
          numberOfEvaluations: numberOfEvaluations,
        };

        // Fetch details from the specific model based on the offre type
        switch (offre.type) {
          case 'hotel':
            offreJson.details = await GrandHotelModel.findOne({
              where: { id_offre: offre.id_offre },
            });
            break;
          case 'voyage':
            offreJson.details = await VoyageModel.findOne({
              where: { id_offre: offre.id_offre },
            });
            break;
          case 'activite':
            offreJson.details = await ActiviteModel.findOne({
              where: { id_offre: offre.id_offre },
            });
            break;
        }
        return offreJson;
      })
    );
    res.status(200).json(offreDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get offres' });
  }
};

exports.createOffreFromCollab = async (req, res) => {
  try {
    const {
      titre,
      description,
      nombre_enfants_gratuits,
      age_limite_gratuite,
      prix_enfants_payants,
      conditions_speciales_enfants,
      enfants_autorises,
      date_debut,
      date_fin,
      prix,
      type,
      remise,
      destination,
      // Additional fields for specific types
      nom_hotel,
      etoiles,
      climatisation,
      wifi,
      piscine_exterieure,
      piscine_couverte,
      bassin_enfants,
      parking,
      discotheque,
      plage_privee,
      ascenseur,
      salle_de_sport,
      aire_de_jeux_enfants,
      programme,
      inclus,
      nbr_jours,
      duree,
      spa,
      sauna,
      hammam,
      thalasso,
      centre_esthetique,
      toboggan,
      pieds_dans_l_eau,
      piscine_eau_de_mer,
      baby_setting,
      tennis_de_table,
      location_de_voiture,
      change_monetaire,
    } = req.body;

    const { id_collaborateur } = req.params;

    const offre = await OffreModel.create({
      titre,
      description,
      nombre_enfants_gratuits,
      age_limite_gratuite,
      prix_enfants_payants,
      conditions_speciales_enfants,
      enfants_autorises,
      date_debut,
      date_fin,
      prix,
      id_collaborateur,
      type,
      remise,
      destination,
    });

    if (req.files && req.files.length > 0) {
      const imageUploads = req.files.map((file) => {
        const imagePath = file.path; // Assumes path handling is already set
        return ImageOffre.create({
          image: imagePath,
          id_offre: offre.id_offre,
        });
      });
      await Promise.all(imageUploads);
    }

    // Create specific type details based on offre type
    switch (type) {
      case 'hotel':
        await GrandHotelModel.create({
          id_offre: offre.id_offre,
          nom_hotel,
          etoiles,
          climatisation,
          wifi,
          piscine_exterieure,
          piscine_couverte,
          bassin_enfants,
          parking,
          discotheque,
          plage_privee,
          ascenseur,
          salle_de_sport,
          aire_de_jeux_enfants,
          spa,
          sauna,
          hammam,
          thalasso,
          centre_esthetique,
          toboggan,
          pieds_dans_l_eau,
          piscine_eau_de_mer,
          baby_setting,
          tennis_de_table,
          location_de_voiture,
          change_monetaire,
        });
        break;
      case 'voyage':
        await VoyageModel.create({
          id_offre: offre.id_offre,
          programme,
          inclus,
          nbr_jours,
        
        });
        break;
      case 'activite':
        await ActiviteModel.create({
          id_offre: offre.id_offre,
          programme,
          inclus,
          duree,
      
        });
        break;
    }

    res.status(201).json({ message: 'Offre created successfully', offre });
  } catch (error) {
    console.error('Error creating offre:', error);
    res
      .status(500)
      .json({ error: 'Failed to create offre', details: error.message });
  }
};

module.exports = exports;
