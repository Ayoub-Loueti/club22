const express = require('express');
const offreController = require('../controllers/OffreController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.post('/offer', authenticate, offreController.createOffre);
router.put('/offer/:offreId', authenticate, offreController.updateOffre);
router.delete('/offer/:offreId', authenticate, offreController.deleteOffre);
router.get('/allOffers', authenticate, offreController.getAllOffres);
router.get('/offer/:offreId', authenticate, offreController.getOffreById);
router.get('/allOffersCollab/:collabId', authenticate, offreController.getAllOffresCollab);

router.get(
  '/employeOffers',
  authenticate,
  offreController.getAllEmployeeOffers
);
router.get(
  '/employeOffer/:offreId',
  authenticate,
  offreController.getEmployeeOfferById
);
module.exports = router;