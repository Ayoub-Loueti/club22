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

module.exports = router;
