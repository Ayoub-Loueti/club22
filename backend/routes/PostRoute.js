const express = require('express');
const router = express.Router();
const postController = require('../controllers/PostController');
const authenticate = require('../middleware/authenticate');


router.post('/createPost', authenticate, postController.createPost);
router.put('/posts/:postId', authenticate, postController.updatePost);
router.delete('/posts/:postId', authenticate, postController.deletePost);

router.get('/posts', authenticate, postController.getAllPosts);
router.get('/getPostById/:id', postController.getPostByIdWithDetails);
router.get('/getAllPostsByUser/:userId', postController.getAllPostsByUserWithDetails);
router.get('/posts/:type', authenticate, postController.getPostsByType);

router.post('/posts/:id_post/enregistrement', authenticate, postController.createEnregistrement);
router.get('/enregistrements', authenticate, postController.getEnregistrementsByUser);
router.delete('/posts/:id_post/enregistrement', authenticate, postController.deleteEnregistrement);
router.get('/posts/:id_post/is-saved', authenticate, postController.checkIfPostIsSaved);

router.post('/signals', authenticate, postController.createSignal);
router.get('/signaler/:id',authenticate, postController.getSignalerById);
router.get('/signaler',authenticate, postController.getSignaler);
router.delete('/signaler/:id',authenticate, postController.deleteSignaler);
router.patch('/signaler/:id', authenticate, postController.updateSignalerStatus);

module.exports = router;
