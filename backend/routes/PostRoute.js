const express = require('express');
const router = express.Router();
const postController = require('../controllers/PostController');
const authenticate = require('../middleware/authenticate');

router.post('/createPost', authenticate, postController.createPost);
router.put('/posts/:postId', authenticate, postController.updatePost);
router.delete('/posts/:postId', authenticate, postController.deletePost);

router.post('/post/:postId/toggle-like', authenticate, postController.toggleLikePost);
router.post('/post/:postId/comment', authenticate, postController.createComment);
router.put('/modifyComment/:id_cmntr', authenticate, postController.modifyComment);
router.delete('/deleteComment/:id_cmntr', authenticate, postController.deleteComment);

router.get('/posts', authenticate, postController.getAllPosts);
router.get('/getPostById/:id', postController.getPostByIdWithDetails);
router.get('/getAllPostsByUser/:userId', postController.getAllPostsByUserWithDetails);

router.get('/post/:postId/likesCount',authenticate,postController.getLikesCount);
router.get('/post/:postId/comment', authenticate, postController.getComments);

router.post('/posts/:id_post/enregistrement', authenticate, postController.createEnregistrement);
router.get('/enregistrements', authenticate, postController.getEnregistrementsByUser);
router.delete('/posts/:id_post/enregistrement', authenticate, postController.deleteEnregistrement);
router.get('/posts/:id_post/is-saved', authenticate, postController.checkIfPostIsSaved);
router.post('/comments/:id_cmntr/responses',authenticate,postController.createReponse);
router.delete('/replies/:id_reponse', authenticate, postController.deleteReply);
router.put('/replies/:id_reponse', authenticate, postController.updateReply);
router.post('/comment/:commentId/toggle-like', authenticate, postController.toggleLikeComment);
router.post('/reponse/:rponseId/toggle-like', authenticate, postController.toggleLikeReponse);
router.get('/comment/:commentId/likesCount',authenticate,postController.getLikesComCount);
router.get('/reponse/:reponseId/likesCount',authenticate,postController.getLikesRepCount);

router.get('/comment/:commentId/afficherLikes', authenticate, postController.getUsersWhoLikedComment);
router.get('/reponse/:responseId/afficherLikes', authenticate, postController.getUsersWhoLikedResponse);

module.exports = router;
