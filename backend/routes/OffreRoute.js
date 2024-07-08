const express = require('express');
const offreController = require('../controllers/OffreController');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post(
  '/offer',
  authenticate,
  upload.array('photos', 4),
  offreController.createOffre
);
router.put(
  '/offer/:offreId',
  authenticate,
  upload.array('photos', 4),
  offreController.updateOffre
);

router.delete('/offer/:offreId', authenticate, offreController.deleteOffre);
router.get('/allOffers', authenticate, offreController.getAllOffres);
router.get('/offer/:offreId', authenticate, offreController.getOffreById);
router.get('/allOffersCollab/:collabId', authenticate, offreController.getAllOffresCollab);
router.get(
  '/offerImages/:offreId',
  authenticate,
  offreController.getOfferImages
);

router.get( '/employeOffers', authenticate, offreController.getAllEmployeeOffers);
router.get( '/employeOffer/:offreId',authenticate, offreController.getEmployeeOfferById);

router.post('/offerFromCollab/:id_collaborateur', upload.array('photos', 4), offreController.createOffreFromCollab);

module.exports = router;