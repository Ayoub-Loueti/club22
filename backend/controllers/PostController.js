const Post  = require('../models/PostModel'); 
const Likes = require('../models/LikesModel'); 
const Utilisateur = require('../models/UtilisateurModel');
const Commentaire = require('../models/CommentairesModel');
const Image = require('../models/ImageModel');
const multiImageUpload = require('../middleware/multiImageUpload');

exports.createPost = (req, res) => {
  multiImageUpload(req, res, async (error) => {
    if (error) {
      res.status(500).json({ message: error.message });
    } else {
      // Using req.userId set by your authentication middleware
      const id_utilisateur = req.userId; // Ensure your authentication middleware sets this
      const { contenu, type } = req.body;

      try {
        const newPost = await Post.create({
          contenu,
          type,
          date_post: new Date(),
          id_utilisateur, // Use the authenticated user's ID
        });

        // Save file information for all uploaded files
        if (req.files && req.files.length > 0) {
          await Promise.all(req.files.map(file => {
            const pathImage = file.path; // Path where the file is saved
            return Image.create({
              pathImage,
              id_post: newPost.id_post,
            });
          }));
        }

        res.status(201).json({ message: "Post created successfully", post: newPost });
      } catch (err) {
        res.status(500).json({ message: "Error creating post", error: err.message });
      }
    }
  });
};

exports.updatePost = async (req, res) => {
    const { contenu, type } = req.body; 
    const postId = req.params.postId; 
    const id_utilisateur = req.userId; 

    try {
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.id_utilisateur !== id_utilisateur) {
            return res.status(403).json({ message: 'User not authorized to update this post' });
        }

        post.contenu = contenu;
        post.type = type;
        await post.save();

        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating post', error });
    }
};

exports.deletePost = async (req, res) => {
    const { postId } = req.params; 
    const id_utilisateur = req.userId;

    try {
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.id_utilisateur !== id_utilisateur) {
            return res.status(403).json({ message: 'User not authorized to delete this post' });
        }

        await post.destroy();

        return res.status(204).send(); // No content to send back
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting post', error });
    }
};

//affichage 

exports.getAllPosts = async (req, res) => {
  const userId = req.userId; // Ensure you have access to the userId, typically set from the auth middleware

  try {
    const posts = await Post.findAll({
      include: [
        {
          model: Utilisateur,
          as: 'utilisateur',
          attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
        },
      ],
    });

    if (!posts.length) {
      return res.status(404).json({ message: 'No posts found' });
    }

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const postJson = post.toJSON();

        // Additional query to check if the current user has liked the post
        const likeStatus = await Likes.findOne({
          where: {
            id_post: post.id_post,
            id_utilisateur: userId,
          },
        });

        // Add a new property to postJson indicating if the current user has liked the post
        postJson.isLikedByCurrentUser = !!likeStatus;

        const images = await Image.findAll({
            where: {
              id_post: post.id_post,
            },
          });
          postJson.lesImages = images;

        // Fetch comments for the post
        const comments = await Commentaire.findAll({
          where: { id_post: post.id_post },
          include: [
            {
              model: Utilisateur,
              as: 'utilisateur',
              attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
            },
          ],
        });
        postJson.commentaires = comments;

        // Fetch likes for the post
        const likes = await Likes.findAll({
          where: { id_post: post.id_post },
          include: [
            {
              model: Utilisateur,
              as: 'utilisateur',
              attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
            },
          ],
        });
        postJson.likesCount = likes.length; // Add likes count
        postJson.likes = likes; // This includes detailed likes info, adjust as needed

        return postJson;
      })
    );

    return res.status(200).json(postsWithDetails);
  } catch (error) {
    console.error('Error fetching all posts with details:', error);
    return res
      .status(500)
      .json({ message: 'Error fetching posts', error: error.message });
  }
};
// Fetch likes count for a post
exports.getLikesCount = async (req, res) => {
    const postId = req.params.postId; // Extract the post ID from the path

    try {
        const likesCount = await Likes.count({
            where: {
                id_post: postId
            }
        });

        return res.status(200).json({ likesCount });
    } catch (error) {
        console.error('Error fetching likes count:', error);
        return res.status(500).json({ message: 'Error fetching likes count', error: error.message });
    }
};

// Fetch comments for a post
exports.getComments = async (req, res) => {
    const postId = req.params.postId; // Extract the post ID from the path

    try {
        const comments = await Commentaire.findAll({
            where: { id_post: postId },
            include: [{
                model: Utilisateur,
                as: 'utilisateur',
                attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
            }],
        });

        return res.status(200).json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};


exports.getPostByIdWithDetails = async (req, res) => {
    const postId = req.params.id; 

    try {
         const post = await Post.findByPk(postId, {
            include: [{
                model: Utilisateur,
                as: 'utilisateur',
                attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
            }]
        });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Manually fetch comments for the post
        const comments = await Commentaire.findAll({
            where: { id_post: postId },
            include: [{
                model: Utilisateur,
                as: 'utilisateur', 
                attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
            }],
        });

        // Manually fetch likes for the post
        const likes = await Likes.findAll({
            where: { id_post: postId },
            include: [{
                model: Utilisateur,
                as: 'utilisateur', 
                attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
            }],
        });

        // Convert Sequelize model instance to JSON and manually aggregate comments and likes into the post data
        const postWithDetails = post.toJSON();
        postWithDetails.commentaires = comments;
        postWithDetails.likes = likes;

        return res.status(200).json(postWithDetails);
    } catch (error) {
        console.error('Error fetching post by ID with details:', error);
        return res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
};

exports.getAllPostsByUserWithDetails = async (req, res) => {
    const userId = req.params.userId; // Capture the user ID from the request parameters

    try {
        // Fetch all posts created by the specified user
       const posts = await Post.findAll({
            where: { id_utilisateur: userId },
            include: [{
                model: Utilisateur,
                as: 'utilisateur', // Adjust if using a different alias
                attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
            }]
        });

        if (!posts.length) {
            return res.status(201).json({ message: 'No posts found for this user' });
        }

        // Manually fetch and aggregate comments and likes for each post
        const postsWithDetails = await Promise.all(posts.map(async (post) => {
            const postJson = post.toJSON();
            const images = await Image.findAll({
                where: {
                  id_post: post.id_post,
                },
              });
              postJson.lesImages = images;
            // Fetch comments for the post
            const comments = await Commentaire.findAll({
                where: { id_post: post.id_post },
                include: [{
                    model: Utilisateur,
                    as: 'utilisateur', // Adjust if using a different alias
                    attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
                }],
            });

            // Fetch likes for the post
            const likes = await Likes.findAll({
                where: { id_post: post.id_post },
                include: [{
                    model: Utilisateur,
                    as: 'utilisateur', // Adjust if using a different alias
                    attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
                }],
            });

            // Manually aggregate comments and likes into the post data
            postJson.commentaires = comments;
            postJson.likes = likes;

            return postJson;
        }));

        return res.status(200).json(postsWithDetails);
    } catch (error) {
        console.error('Error fetching posts by user with details:', error);
        return res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

// commnts and likes 

exports.toggleLikePost = async (req, res) => {
    const postId = req.params.postId; // Extract the post ID from the path
    const id_utilisateur = req.userId; // Extract user ID set by your authentication middleware

    try {
        // Check if the user has already liked this post
        const existingLike = await Likes.findOne({
            where: {
                id_post: postId,
                id_utilisateur: id_utilisateur
            }
        });

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (existingLike) {
            // If a like exists, unlike the post
            await existingLike.destroy();
            await post.decrement('nbr_likes');
            return res.status(200).json({ message: 'Post unliked successfully' });
        } else {
            // If no like exists, like the post, including the current date and time for date_like
            await Likes.create({
                id_post: postId,
                id_utilisateur: id_utilisateur,
                date_like: new Date() // Set the current date and time
            });
            await post.increment('nbr_likes');
            return res.status(200).json({ message: 'Post liked successfully' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error toggling post like', error });
    }
};

exports.createComment = async (req, res) => {
    const { cmntr } = req.body; // Extract comment content from request body
    const postId = req.params.postId; // Extract the post ID from the path
    const id_utilisateur = req.userId; // Extract user ID set by your authentication middleware

    try {
        // Optional: Check if the post exists before allowing a comment to be created
        const postExists = await Post.findByPk(postId);
        if (!postExists) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = await Commentaire.create({
            cmntr: cmntr,
            id_post: postId,
            id_utilisateur: id_utilisateur,
            date_cmntr: new Date() // Set the comment date to now
        });

        return res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ message: 'Error creating comment', error });
    }
};

exports.modifyComment = async (req, res) => {
    const { id_cmntr } = req.params; // Comment ID from URL parameters
    const { newContent } = req.body; // New comment content from the request body
    const userId = req.userId; // User ID from the request, typically set after authentication

    try {
        const comment = await Commentaire.findByPk(id_cmntr);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user making the request is the owner of the comment or has other valid permissions
        if (comment.id_utilisateur !== userId) {
            return res.status(403).json({ message: 'User not authorized to modify this comment' });
        }

        comment.cmntr = newContent; // Update the comment content
        await comment.save();

        return res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        console.error('Error modifying comment:', error);
        return res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    const { id_cmntr } = req.params; // Comment ID from URL parameters
    const userId = req.userId; // User ID from the request, typically set after authentication

    try {
        const comment = await Commentaire.findByPk(id_cmntr);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.id_utilisateur !== userId) {
            return res.status(403).json({ message: 'User not authorized to delete this comment' });
        }

        await comment.destroy();

        return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};

module.exports = exports;
