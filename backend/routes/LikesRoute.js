const express = require('express');
const router = express.Router();
const LikesController = require('../controllers/LikesController');
const authenticate = require('../middleware/authenticate');

router.get('/post/:postId/likesCount',authenticate,LikesController.getLikesCount);
router.post('/post/:postId/toggle-like', authenticate, LikesController.toggleLikePost);

router.post('/comment/:commentId/toggle-like', authenticate, LikesController.toggleLikeComment);
router.get('/comment/:commentId/likesCount',authenticate,LikesController.getLikesComCount);
router.get('/comment/:commentId/afficherLikes', authenticate, LikesController.getUsersWhoLikedComment);

router.post('/reponse/:rponseId/toggle-like', authenticate, LikesController.toggleLikeReponse);
router.get('/reponse/:reponseId/likesCount',authenticate,LikesController.getLikesRepCount);
router.get('/reponse/:responseId/afficherLikes', authenticate, LikesController.getUsersWhoLikedResponse);

module.exports = router;
