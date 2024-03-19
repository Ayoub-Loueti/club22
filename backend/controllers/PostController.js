const Post  = require('../models/PostModel'); 
const Likes = require('../models/LikesModel'); 
const Utilisateur = require('../models/UtilisateurModel');
const Commentaire = require('../models/CommentairesModel');
const Notification = require('../models/NotificationModel');
const Image = require('../models/ImageModel');
const Enregistrement = require('../models/EnregistrementModel');
const multiImageUpload = require('../middleware/multiImageUpload');
const Reponse = require('../models/ReponseModel');
const LikeCom = require('../models/LikeComModel');
const LikeRep = require('../models/LikeRepModel');

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
  const userId = req.userId;

  try {
    const commentss = await Commentaire.findAll({
      where: { id_post: postId },
      include: [{
        model: Utilisateur,
        as: 'utilisateur',
        attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
      }],
    });

    const commentsWithLikes = await Promise.all(commentss.map(async (comment) => {
      const commentJson = comment.toJSON();

      // Check like status for each comment
      const likeStatus = await LikeCom.findOne({
        where: {
          id_cmntr: comment.id_cmntr,
          id_utilisateur: userId,
        },
      });
      commentJson.isComLikedByCurrentUser = !!likeStatus;

      // Fetch and attach responses
      const reponses = await Reponse.findAll({
        where: { id_cmntr: comment.id_cmntr },
        include: [
          {
            model: Utilisateur,
            as: 'utilisateur',
            attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
          },
        ],
      });

      // Enrich responses with like status
      commentJson.reponses = await Promise.all(reponses.map(async (reponse) => {
        const reponseJson = reponse.toJSON();
        const likeStatusResponse = await LikeRep.findOne({
          where: {
            id_reponse: reponse.id_reponse,
            id_utilisateur: userId,
          },
        });
        reponseJson.isRepLikedByCurrentUser = !!likeStatusResponse;
        return reponseJson;
      }));

      return commentJson;
    }));

    return res.status(200).json({ comments: commentsWithLikes });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};


exports.getPostByIdWithDetails = async (req, res) => {
    const postId = req.params.id; 
    const userId = req.userId;
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
        const likeStatus = await Likes.findOne({
          where: {
            id_post: post.id_post,
            id_utilisateur: post.utilisateur.id_utilisateur,
          },
        });

        // Add a new property to postJson indicating if the current user has liked the post
        // Manually fetch comments for the post
        const comments = await Commentaire.findAll({
            where: { id_post: postId },
            include: [{
                model: Utilisateur,
                as: 'utilisateur', 
                attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
            }],
        });
        const images = await Image.findAll({
          where: {
            id_post: post.id_post,
          },
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
        postWithDetails.isLikedByCurrentUser = !!likeStatus;
        postWithDetails.commentaires = comments;
        postWithDetails.likes = likes;
        postWithDetails.lesImages = images;
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

            const likeStatus = await Likes.findOne({
              where: {
                id_post: post.id_post,
                id_utilisateur: userId,
              },
            });
    
            // Add a new property to postJson indicating if the current user has liked the post
            postJson.isLikedByCurrentUser = !!likeStatus;
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
      const post = await Post.findByPk(postId, {
        include: [{
          model: Utilisateur,
          as: 'utilisateur'
        }]
      });
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      const existingLike = await Likes.findOne({
          where: {
              id_post: postId,
              id_utilisateur: id_utilisateur
          }
      });

      if (existingLike) {
          // If a like exists, unlike the post and remove notification
          await existingLike.destroy();
          await post.decrement('nbr_likes');

          // Find and destroy the like notification
          const likeNotification = await Notification.findOne({
              where: {
                  id_post: postId,
                  id_utilisateur: id_utilisateur,
                  id_like: existingLike.id_like,
              }
          });
          if (likeNotification) {
              await likeNotification.destroy();

              // Decrement the notification count for the post owner if greater than zero
              const postOwner = await Utilisateur.findByPk(post.id_utilisateur);
              if (postOwner && postOwner.nbr_notifs > 0 ) {
                  await postOwner.decrement('nbr_notifs', { by: 1 });
              }
          }

          return res.status(200).json({ message: 'Post unliked successfully' });
      } else {
          // If no like exists, like the post
          const like = await Likes.create({
              id_post: postId,
              id_utilisateur: id_utilisateur,
              date_like: new Date()
          });
          await post.increment('nbr_likes');

          // Do not create a notification if the user liking is the post owner
          if (id_utilisateur !== post.id_utilisateur) {
              // Create a like notification
              await Notification.create({
                  id_post: postId,
                  notifier: 'a aimé votre publication',
                  id_own_post: post.id_utilisateur,
                  id_utilisateur: id_utilisateur,
                  date_notif: new Date(),
                  id_like: like.id_like,
                  id_notifier: post.id_utilisateur, // Assuming id_notifier is the user being notified
                  type: 'like'
              });

              // Increment the notification count for the post owner
              const postOwner = await Utilisateur.findByPk(post.id_utilisateur);
              if (postOwner) {
                  await postOwner.increment('nbr_notifs', { by: 1 });
              }
          }

          return res.status(200).json({ message: 'Post liked successfully' });
      }
  } catch (error) {
      console.error('Error toggling post like:', error);
      return res.status(500).json({ message: 'Error toggling post like', error });
  }
};


exports.createComment = async (req, res) => {
  const { cmntr } = req.body; // Extract comment content from request body
  const postId = req.params.postId; // Extract the post ID from the path
  const id_utilisateur = req.userId; // Extract user ID set by your authentication middleware

  try {
    const post = await Post.findByPk(postId, {
      include: [{
        model: Utilisateur,
        as: 'utilisateur'
      }]
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = await Commentaire.create({
      cmntr: cmntr,
      id_post: postId,
      id_utilisateur: id_utilisateur,
      date_cmntr: new Date()
    });

    // Do not create a notification if the user commenting is the post owner
    if (id_utilisateur !== post.id_utilisateur) {
      await Notification.create({
        id_post: postId,
        notifier: 'a commenté votre publication',
        id_own_post: post.id_utilisateur,
        id_utilisateur: id_utilisateur,
        date_notif: new Date(),
        id_cmntr: newComment.id_cmntr,
        id_notifier: post.id_utilisateur, // Assuming id_notifier is the user being notified
        type: 'comment'
      });

      // Increment the notification count for the post owner
      const postOwner = await Utilisateur.findByPk(post.id_utilisateur);
      if (postOwner) {
        await postOwner.increment('nbr_notifs', { by: 1 });
      }
    }

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
      const comment = await Commentaire.findByPk(id_cmntr, {
          include: [{
              model: Post,
              as: 'post', // Make sure this alias matches how you've set it up in associations
          }]
      });

      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      if (comment.id_utilisateur !== userId) {
          return res.status(403).json({ message: 'User not authorized to delete this comment' });
      }

      // Find and delete the associated notification
      await Notification.destroy({
        where: { id_cmntr: id_cmntr }
    });

      await comment.destroy();

      // If the comment is associated with a post, check the notification count before decrementing for the post owner
      if (comment.post && comment.post.id_utilisateur) {
          const postOwner = await Utilisateur.findByPk(comment.post.id_utilisateur);
          if (postOwner && postOwner.nbr_notifs > 0) {
              // Only decrement if nbr_notifs is greater than 0
              await postOwner.decrement('nbr_notifs', { by: 1 });
          }
      }

      return res.status(200).json({ message: 'Comment and associated notification deleted successfully' });
  } catch (error) {
      console.error('Error deleting comment and notification:', error);
      return res.status(500).json({ message: 'Error deleting comment and notification', error: error.message });
  }
};


// save posts

exports.createEnregistrement = async (req, res) => {
    const id_utilisateur = req.userId; // Obtained from authentication middleware
    const id_post = req.params.id_post; // Obtained from URL path
  
    try {
      // Check if the post exists
      const postExists = await Post.findByPk(id_post);
      if (!postExists) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the enregistrement already exists for this user and post
      const existingEnregistrement = await Enregistrement.findOne({
        where: {
          id_utilisateur: id_utilisateur,
          id_post: id_post
        }
      });
  
      if (existingEnregistrement) {
        // Enregistrement already exists, so inform the user
        return res.status(409).json({ message: 'Post already saved' });
      }
  
      // Since the enregistrement doesn't exist, create it
      const newEnregistrement = await Enregistrement.create({
        id_utilisateur,
        id_post
      });
  
      return res.status(201).json({ message: 'Enregistrement created successfully', enregistrement: newEnregistrement });
    } catch (error) {
      console.error('Error creating enregistrement:', error);
      return res.status(500).json({ message: 'Error creating enregistrement', error: error.message });
    }
  };
  

  exports.getEnregistrementsByUser = async (req, res) => {
    const userId = req.userId; // Assuming userId is set by your authentication middleware
  
    try {
      // First, find all enregistrements for the current user
      const enregistrements = await Enregistrement.findAll({
        where: {
          id_utilisateur: userId,
        },
        include: [
          {
            model: Post,
            as: 'post',
            include: [
              {
                model: Utilisateur,
                as: 'utilisateur',
                attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
              }
            ]
          }
        ]
      });
  
      if (!enregistrements.length) {
        return res.status(404).json({ message: 'No saved posts found' });
      }
  
      // Transform enregistrements to include post details similarly to getAllPosts
      const postsWithDetails = await Promise.all(
        enregistrements.map(async (enregistrement) => {
          const post = enregistrement.post;
          const postJson = post.toJSON();
  
          // Check if the current user has liked the post
          const likeStatus = await Likes.findOne({
            where: {
              id_post: post.id_post,
              id_utilisateur: userId,
            },
          });
          postJson.isLikedByCurrentUser = !!likeStatus;
  
          // Fetch images for the post
          const images = await Image.findAll({
            where: { id_post: post.id_post },
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
          postJson.likesCount = likes.length;
          postJson.likes = likes;
  
          return postJson;
        })
      );
  
      return res.status(200).json(postsWithDetails);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      return res.status(500).json({ message: 'Error fetching saved posts', error: error.message });
    }
  };
  
  exports.deleteEnregistrement = async (req, res) => {
    const userId = req.userId; // Assuming userId is set by your authentication middleware
    const { id_post } = req.params; // Assuming the post ID is passed in the URL

    try {
        // First, find the enregistrement to ensure it exists and belongs to the current user
        const enregistrement = await Enregistrement.findOne({
            where: {
                id_utilisateur: userId,
                id_post: id_post
            }
        });

        if (!enregistrement) {
            return res.status(404).json({ message: 'Saved post not found or not owned by the user' });
        }

        // Delete the enregistrement
        await enregistrement.destroy();

        return res.status(200).json({ message: 'Post unsaved successfully' });
    } catch (error) {
        console.error('Error deleting saved post:', error);
        return res.status(500).json({ message: 'Error deleting saved post', error: error.message });
    }
};

exports.checkIfPostIsSaved = async (req, res) => {
    const userId = req.userId; // Assuming userId is set by your authentication middleware
    const { id_post } = req.params; // Assuming the post ID is passed in the URL

    try {
        // Check if there is an enregistrement for the current user and post
        const savedPost = await Enregistrement.findOne({
            where: {
                id_utilisateur: userId,
                id_post: id_post
            }
        });

        // If the post is saved by the user, return 1, else return 0
        const isSaved = savedPost ? 1 : 0;

        return res.status(200).json({ isSaved });
    } catch (error) {
        console.error('Error checking if post is saved:', error);
        return res.status(500).json({ message: 'Error checking if post is saved', error: error.message });
    }
};

exports.createReponse = async (req, res) => {
  const id_utilisateur = req.userId; // The ID of the user making the reply, e.g., Aymen
  const { id_cmntr } = req.params; // The ID of the comment being replied to, e.g., Taher's comment
  const { contenu } = req.body; // The content of the reply

  try {
    // First, find the comment being replied to, including the post information
    const comment = await Commentaire.findByPk(id_cmntr, {
      include: [{ model: Post, as: 'post' }],
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Create the reply
    const newReponse = await Reponse.create({
      contenu,
      id_cmntr: comment.id_cmntr,
      id_utilisateur,
    });

    // Determine the scenarios to notify users
    const isPostOwner = id_utilisateur === comment.post.id_utilisateur; // Is Aymen also Ayoub (the post owner)?
    const isCommentOwner = id_utilisateur === comment.id_utilisateur; // Is Aymen also Taher (the comment owner)?

    // Notify Taher (the comment owner) if Aymen is not Taher
    if (!isCommentOwner) {
      await Notification.create({
        id_post: comment.id_post,
        notifier: 'a répondu à votre commentaire',
        id_reponse: newReponse.id_reponse,
        isRead: false,
        id_own_post: comment.post.id_utilisateur, // Ayoub
        id_notifier: comment.id_utilisateur, // Taher
        id_utilisateur: id_utilisateur, // Aymen
        date_notif: new Date(),
        type: 'comment',
        id_cmntr: newReponse.id_cmntr,
      });
      // Increment `nbr_notifs` for Taher
      await Utilisateur.increment('nbr_notifs', { by: 1, where: { id_utilisateur: comment.id_utilisateur } });
    }

    // Notify Ayoub (the post owner) if Aymen is not Ayoub and the comment belongs to someone else (Taher)
    if (!isPostOwner && comment.id_utilisateur !== comment.post.id_utilisateur) {
      await Notification.create({
        id_post: comment.id_post,
        notifier: 'a répondu à un commentaire dans votre post',
        id_reponse: newReponse.id_reponse,
        isRead: false,
        id_own_post: comment.post.id_utilisateur, // Ayoub
        id_notifier: comment.post.id_utilisateur, // Ayoub
        id_utilisateur: id_utilisateur, // Aymen
        date_notif: new Date(),
        type: 'comment',
        id_cmntr: newReponse.id_cmntr,
      });
      // Increment `nbr_notifs` for Ayoub
      await Utilisateur.increment('nbr_notifs', { by: 1, where: { id_utilisateur: comment.post.id_utilisateur } });
    }

    return res.status(201).json(newReponse);
  } catch (error) {
    console.error('Error creating reply:', error);
    return res.status(500).json({ message: 'Error creating reply', error: error.message });
  }
};

exports.deleteReply = async (req, res) => {
  const { id_reponse } = req.params;
  const userId = req.userId;

  try {
      // Fetch the reply to be deleted
      const reply = await Reponse.findByPk(id_reponse);
      if (!reply) {
          return res.status(404).json({ message: 'Reply not found' });
      }

      // Ensure that the user is authorized to delete the reply
      if (reply.id_utilisateur !== userId) {
          return res.status(403).json({ message: 'User not authorized to delete this reply' });
      }

      // Fetch notifications associated with the reply to identify affected users
      const notifications = await Notification.findAll({
          where: { id_reponse: id_reponse }
      });

      // Delete notifications associated with this reply
      await Notification.destroy({
          where: { id_reponse: id_reponse }
      });

      // Decrement `nbr_notifs` for each affected user
      const affectedUserIds = notifications.map(notif => notif.id_notifier);
      for (let userId of affectedUserIds) {
          // Fetch user to check current `nbr_notifs`
          const user = await Utilisateur.findByPk(userId);
          if (user && user.nbr_notifs > 0 ) {
              // Decrement `nbr_notifs` if it's greater than 0
              await Utilisateur.decrement('nbr_notifs', { by: 1, where: { id_utilisateur: userId } });
          }
      }

      // Delete the reply
      await reply.destroy();

      return res.status(200).json({ message: 'Reply and associated notifications deleted successfully' });
  } catch (error) {
      console.error('Error deleting reply and notifications:', error);
      return res.status(500).json({ message: 'Error deleting reply and notifications', error: error.message });
  }
};

exports.updateReply = async (req, res) => {
  const { id_reponse } = req.params; // ID of the reply to be updated
  const { contenu } = req.body; // New content for the reply
  const userId = req.userId; // User ID from authentication

  try {
      const reply = await Reponse.findByPk(id_reponse);

      if (!reply) {
          return res.status(404).json({ message: 'Reply not found' });
      }

      // Check if the user is authorized to update this reply
      if (reply.id_utilisateur !== userId) {
          return res.status(403).json({ message: 'User not authorized to update this reply' });
      }

      // Update the reply content
      reply.contenu = contenu;
      await reply.save();

      return res.status(200).json({ message: 'Reply updated successfully', reply });
  } catch (error) {
      console.error('Error updating reply:', error);
      return res.status(500).json({ message: 'Error updating reply', error: error.message });
  }
};

exports.toggleLikeComment = async (req, res) => {
  const commentId = req.params.commentId; // Extract the post ID from the path
  const id_utilisateur = req.userId; // Extract user ID set by your authentication middleware

  try {
      const comment = await Commentaire.findByPk(commentId, {
        include: [{
          model: Utilisateur,
          as: 'utilisateur'
        },{
          model: Post,
          as: 'post'
        }
      ]
      });
      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      const existingLike = await LikeCom.findOne({
          where: {
              id_cmntr: commentId,
              id_utilisateur: id_utilisateur
          }
      });

      if (existingLike) {
          // If a like exists, unlike the post and remove notification
          await existingLike.destroy();
          await comment.decrement('nbr_likeCom');

          // Find and destroy the like notification
          const likeNotification = await Notification.findOne({
              where: {
                  id_post: comment.id_post,
                  id_utilisateur: id_utilisateur,
                  id_likeCom: existingLike.id_likeCom,
              }
          });
          if (likeNotification) {
              await likeNotification.destroy();

              // Decrement the notification count for the post owner if greater than zero
              const commentOwner = await Utilisateur.findByPk(comment.id_utilisateur);
              if (commentOwner && commentOwner.nbr_notifs > 0 ) {
                  await commentOwner.decrement('nbr_notifs', { by: 1 });
              }
          }

          return res.status(200).json({ message: 'Comment unliked successfully' });
      } else {
          // If no like exists, like the post
          const like = await LikeCom.create({
              id_cmntr: commentId,
              id_utilisateur: id_utilisateur,
              date_likeCom: new Date()
          });
          await comment.increment('nbr_likeCom');

          // Do not create a notification if the user liking is the post owner
          if (id_utilisateur !== comment.id_utilisateur) {
              // Create a like notification
              await Notification.create({
                  id_post: comment.id_post,
                  notifier: 'a aimé votre commentaire',
                  id_own_post: comment.post.id_utilisateur,
                  id_utilisateur: id_utilisateur,
                  date_notif: new Date(),
                  id_likeCom: like.id_likeCom,
                  id_notifier: comment.id_utilisateur, // Assuming id_notifier is the user being notified
                  type: 'like',
                  id_cmntr: commentId,
              });

              // Increment the notification count for the post owner
              const postOwner = await Utilisateur.findByPk(comment.id_utilisateur);
              if (postOwner) {
                  await postOwner.increment('nbr_notifs', { by: 1 });
              }
          }

          return res.status(200).json({ message: 'Comment liked successfully' });
      }
  } catch (error) {
      console.error('Error toggling Comment like:', error);
      return res.status(500).json({ message: 'Error toggling comment like', error });
  }
};

exports.toggleLikeReponse = async (req, res) => {
  const rponseId = req.params.rponseId; // Extract the response ID from the path
  const id_utilisateur = req.userId; // Extract user ID set by your authentication middleware

  try {
    // Find the response including the user who made it and the comment it belongs to
    const reponse = await Reponse.findByPk(rponseId, {
      include: [{
        model: Utilisateur,
        as: 'utilisateur'
      }, {
        model: Commentaire,
        as: 'commentaire',
        include: [{
          model: Post,
          as: 'post'
        }]
      }]
    });

    if (!reponse) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Check if there's an existing like by this user on this response
    const existingLike = await LikeRep.findOne({
      where: {
        id_reponse: rponseId,
        id_utilisateur: id_utilisateur
      }
    });

    if (existingLike) {
      // If a like exists, unlike the response and remove the like
      await existingLike.destroy();
      await reponse.decrement('nbr_likeRep');

      // Find and destroy the like notification associated with this like
      const likeNotification = await Notification.findOne({
        where: {
          id_post: reponse.commentaire.id_post,
          id_utilisateur: id_utilisateur,
          id_likeRep: existingLike.id_likeRep,
        }
      });
      if (likeNotification) {
        await likeNotification.destroy();

        // Decrement the notification count for the comment owner if greater than zero
        const commentOwner = await Utilisateur.findByPk(reponse.id_utilisateur);
        if (commentOwner && commentOwner.nbr_notifs > 0) {
          await commentOwner.decrement('nbr_notifs', { by: 1 });
        }
      }

      return res.status(200).json({ message: 'Response unliked successfully' });
    } else {
      // If no like exists, like the response
      const like = await LikeRep.create({
        id_reponse: rponseId,
        id_utilisateur: id_utilisateur,
        date_likeRep: new Date()
      });
      await reponse.increment('nbr_likeRep');

      // Only notify if the user liking the response is not the comment or post owner
      if (id_utilisateur !== reponse.id_utilisateur ) {
        // Create a like notification
        await Notification.create({
          id_post: reponse.commentaire.id_post,
          notifier: 'a aimé votre réponse',
          id_utilisateur: id_utilisateur,
          id_own_post:reponse.commentaire.post.id_utilisateur,
          date_notif: new Date(),
          id_likeRep: like.id_likeRep,
          id_notifier: reponse.id_utilisateur, // Notify the response creator
          type: 'like',
          id_reponse:rponseId,
        });

        // Increment the notification count for the response owner
        const responseOwner = await Utilisateur.findByPk(reponse.id_utilisateur);
        if (responseOwner) {
          await responseOwner.increment('nbr_notifs', { by: 1 });
        }
      }

      return res.status(200).json({ message: 'Response liked successfully' });
    }
  } catch (error) {
    console.error('Error toggling response like:', error);
    return res.status(500).json({ message: 'Error toggling response like', error: error.message });
  }
};

exports.getLikesComCount = async (req, res) => {
  const commentId = req.params.commentId; // Extract the post ID from the path

  try {
      const likesCount = await LikeCom.count({
          where: {
              id_cmntr: commentId
          }
      });

      return res.status(200).json({ likesCount });
  } catch (error) {
      console.error('Error fetching likes count:', error);
      return res.status(500).json({ message: 'Error fetching likes count', error: error.message });
  }
};

exports.getLikesRepCount = async (req, res) => {
  const reponseId = req.params.reponseId; // Extract the post ID from the path

  try {
      const likesCount = await LikeRep.count({
          where: {
              id_reponse: reponseId
          }
      });

      return res.status(200).json({ likesCount });
  } catch (error) {
      console.error('Error fetching likes count:', error);
      return res.status(500).json({ message: 'Error fetching likes count', error: error.message });
  }
};

exports.getUsersWhoLikedComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const likes = await LikeCom.findAll({
      where: { id_cmntr: commentId },
      include: [{
        model: Utilisateur,
        as: 'utilisateur',
        attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
      }]
    });

    if (!likes.length) {
      return res.status(404).json({ message: 'No likes found for this comment' });
    }

    return res.status(200).json({ likes });
  } catch (error) {
    console.error('Error fetching users who liked the comment:', error);
    return res.status(500).json({ message: 'Error fetching users who liked the comment', error: error.message });
  }
};

exports.getUsersWhoLikedResponse = async (req, res) => {
  const { responseId } = req.params;
  try {
    const likes = await LikeRep.findAll({
      where: { id_reponse: responseId },
      include: [{
        model: Utilisateur,
        as: 'utilisateur',
        attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
      }]
    });

    if (!likes.length) {
      return res.status(404).json({ message: 'No likes found for this response' });
    }

    return res.status(200).json({ likes });
  } catch (error) {
    console.error('Error fetching users who liked the response:', error);
    return res.status(500).json({ message: 'Error fetching users who liked the response', error: error.message });
  }
};

module.exports = exports;
