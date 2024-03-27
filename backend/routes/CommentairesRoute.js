const express = require('express');
const router = express.Router();
const CommentairesController = require('../controllers/CommentairesController');
const authenticate = require('../middleware/authenticate');

router.post('/post/:postId/comment', authenticate, CommentairesController.createComment);
router.put('/modifyComment/:id_cmntr', authenticate, CommentairesController.modifyComment);
router.delete('/deleteComment/:id_cmntr', authenticate, CommentairesController.deleteComment);

router.get('/post/:postId/comment', authenticate, CommentairesController.getComments);

router.post('/comments/:id_cmntr/responses',authenticate,CommentairesController.createReponse);
router.delete('/replies/:id_reponse', authenticate, CommentairesController.deleteReply);
router.put('/replies/:id_reponse', authenticate, CommentairesController.updateReply);

module.exports = router;
