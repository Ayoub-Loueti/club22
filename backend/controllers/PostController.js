const Post  = require('../models/PostModel'); 
const Likes = require('../models/LikesModel'); 
const Utilisateur = require('../models/UtilisateurModel');
const Commentaire = require('../models/CommentairesModel');
const Notification = require('../models/NotificationModel');
const Image = require('../models/ImageModel');
const Enregistrement = require('../models/EnregistrementModel');
const multiImageUpload = require('../middleware/multiImageUpload');
const Offre = require('../models/OffreModel');
const Client = require('../models/ClientModel');
const Collaborateur = require ('../models/CollaborateurModel');
const Mention = require ('../models/MentionModel');
const Signaler = require('../models/SignalerModel');
const Hachtag = require('../models/HachtagModel');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const { Sequelize } = require('sequelize'); 

// crud 

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

        // Extract individual words from the post content (contenu)
        const offers = await Offre.findAll();

        // Iterate over each offer to check if its title is mentioned in the post content
        await Promise.all(offers.map(async (offer) => {
          if (contenu.includes(offer.titre) || contenu.includes(offer.description)) {
            await Mention.create({
              id_post: newPost.id_post,
              id_offre: offer.id_offre,
            });
          }
        }));
        const words = contenu.split(/\s+/);
        await Promise.all(words.map(async (word) => {
          if (word.startsWith('#') && word.length > 1 && !/\s/.test(word.slice(1))) {
            const hashtag = word.slice(1); // Extract the hashtag without '#'
            if (hashtag.length > 0) { 
              await Hachtag.create({
                id_post: newPost.id_post,
                hachtag: hashtag
              });
            }
          }
        }));      
        // Check if the id_utilisateur exists in the client table
        const existingClient = await Client.findOne({ where: { id_utilisateur } });
        if (existingClient) {
          // Check if it has been a week since the last points were added
          const lastPointsAddition = existingClient.derniereAddition; // Corrected variable name
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          if (!lastPointsAddition || lastPointsAddition < oneWeekAgo) {
            // If it has been more than a week, add the points and update the derniereAddition field
            await Client.update({ points: existingClient.points + 10, derniereAddition: new Date() }, { where: { id_utilisateur } });
            await Notification.create({
              id_post: newPost.id_post,
              notifier: '10 points sont ajoutés à votre boutique',
              id_own_post: id_utilisateur,
              id_utilisateur: id_utilisateur,
              date_notif: new Date(),
              type: 'post',
              id_notifier:id_utilisateur,
            });
            const postOwner = await Utilisateur.findByPk(id_utilisateur);
            if (postOwner) {
              await postOwner.increment('nbr_notifs', { by: 1 });
            }
          }
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

            const collabs = await Mention.findAll({
              where: {
                id_post: post.id_post,
              },
              include: [
                {
                  model: Offre,
                  as: 'offre',
                  attributes: ['id_offre', 'titre'],
                  include: [
                    {
                      model: Collaborateur,
                      as: 'collaborateur',
                      attributes: ['id_collaborateur', 'nom'],
                    },
                  ],
                },
              ],
            });
            postJson.lesCollab = collabs;
          
          
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
        const collabs = await Mention.findAll({
          where: {
            id_post: post.id_post,
          },
          include: [
            {
              model: Offre,
              as: 'offre',
              attributes: ['id_offre', 'titre'],
              include: [
                {
                  model: Collaborateur,
                  as: 'collaborateur',
                  attributes: ['id_collaborateur', 'nom'],
                },
              ],
            },
          ],
        });
        
        // Convert Sequelize model instance to JSON and manually aggregate comments and likes into the post data
        const postWithDetails = post.toJSON();
        postWithDetails.isLikedByCurrentUser = !!likeStatus;
        postWithDetails.commentaires = comments;
        postWithDetails.likes = likes;
        postWithDetails.lesImages = images;
        postWithDetails.lesCollab = collabs;
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
            const collabs = await Mention.findAll({
              where: {
                id_post: post.id_post,
              },
              include: [
                {
                  model: Offre,
                  as: 'offre',
                  attributes: ['id_offre', 'titre'],
                  include: [
                    {
                      model: Collaborateur,
                      as: 'collaborateur',
                      attributes: ['id_collaborateur', 'nom'],
                    },
                  ],
                },
              ],
            });
            postJson.lesCollab = collabs;
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

exports.getPostsByType = async (req, res) => {
  const userId = req.userId; // Ensure you have access to the userId, typically set from the auth middleware
  const type = req.params.type;

  try {
    const posts = await Post.findAll({
      where: {
        type: type // Filter posts by type
      },
      include: [
        {
          model: Utilisateur,
          as: 'utilisateur',
          attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
        },
      ],
    });

    if (!posts.length) {
      return res.status(404).json({ message: 'No posts found for this type' });
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
        const collabs = await Mention.findAll({
          where: {
            id_post: post.id_post,
          },
          include: [
            {
              model: Offre,
              as: 'offre',
              attributes: ['id_offre', 'titre'],
              include: [
                {
                  model: Collaborateur,
                  as: 'collaborateur',
                  attributes: ['id_collaborateur', 'nom'],
                },
              ],
            },
          ],
        });
        postJson.lesCollab = collabs;
        postJson.likesCount = likes.length; // Add likes count
        postJson.likes = likes; // This includes detailed likes info, adjust as needed

        return postJson;
      })
    );

    return res.status(200).json(postsWithDetails);
  } catch (error) {
    console.error('Error fetching posts by type:', error);
    return res
      .status(500)
      .json({ message: 'Error fetching posts', error: error.message });
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

          const collabs = await Mention.findAll({
            where: {
              id_post: post.id_post,
            },
            include: [
              {
                model: Offre,
                as: 'offre',
                attributes: ['id_offre', 'titre'],
                include: [
                  {
                    model: Collaborateur,
                    as: 'collaborateur',
                    attributes: ['id_collaborateur', 'nom'],
                  },
                ],
              },
            ],
          });
          postJson.lesCollab = collabs;
          
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

//signaler

exports.createSignal = async (req, res) => {
  const { id_post, id_cmntr, id_reponse } = req.body;
  const id_utilisateur = req.userId; 

  try {
    // Check if a similar signal already exists
    const signalExists = await Signaler.findOne({
      where: {
        id_post: id_post,
        id_cmntr: id_cmntr || 0,
        id_reponse: id_reponse || 0,
        id_utilisateur: id_utilisateur
      }
    });

    if (signalExists) {
      return res.status(409).json({ message: 'Signal already exists' });
    }

    // Create a new signal
    const newSignal = await Signaler.create({
      id_post: id_post,
      id_cmntr: id_cmntr || 0,
      id_reponse: id_reponse || 0,
      id_utilisateur: id_utilisateur
    });

    return res.status(201).json({
      message: 'Report submitted successfully',
      signal: newSignal
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    return res.status(500).json({
      message: 'Error submitting report',
      error: error.message
    });
  }
};

exports.getAllSignaler = async (req, res) => {
  const userId = req.userId; // Ensure you have access to the userId, typically set from the auth middleware

  try {
      // First, verify if the current user is an admin
      const currentUser = await Utilisateur.findByPk(userId);
      if (!currentUser || currentUser.type !== 'admin') {
          return res.status(403).json({ message: 'Access denied. Only admins can perform this operation.' });
      }

      // Fetch all Signaler entries with related Post and Utilisateur information
      const allSignalerEntries = await Signaler.findAll({
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
                  ],
                  attributes: ['id_post', 'id_utilisateur' ,'contenu', 'type']
              },
              {
                  model: Utilisateur,
                  as: 'utilisateur',
                  attributes: ['id_utilisateur', 'nom', 'prenom', 'photo']
              }
          ]
      });

      if (!allSignalerEntries.length) {
          return res.status(404).json({ message: 'No signals found' });
      }

      return res.status(200).json(allSignalerEntries);
  } catch (error) {
      console.error('Error fetching signals:', error);
      return res.status(500).json({ message: 'Error fetching signals', error: error.message });
  }
};

exports.deleteSignaler = async (req, res) => {
  const signalerId = req.params.id;  // ID of the 'Signaler' from the URL parameter

  try {
      const signaler = await Signaler.findByPk(signalerId);

      if (!signaler) {
          return res.status(404).json({ message: 'Signaler entry not found' });
      }

      await signaler.destroy();  // Delete the found signaler
      return res.status(200).json({ message: 'Signaler deleted successfully' });
  } catch (error) {
      console.error('Error deleting Signaler:', error);
      return res.status(500).json({ message: 'Error deleting Signaler', error: error.message });
  }
};

exports.updateSignalerStatus = async (req, res) => {
  const signalerId  = req.params.id ; // Assuming you're passing the notification ID in the URL
  const { isRead } = req.body; // Assuming you're passing the new status in the request body

  try {
      const notification = await Signaler.findByPk(signalerId);

      if (!notification) {
          return res.status(404).json({ message: 'signaler not found' });
      }

      await notification.update({ isRead });

      return res.status(200).json({ message: 'Notification status updated successfully', notification });
  } catch (error) {
      console.error('Error updating notification status:', error);
      return res.status(500).json({ message: 'Error updating notification status', error });
  }
};

exports.updateAllSignalerOpen = async (req, res) => {
  try {
      await Signaler.update({ isOpen: true }, {
          where: {} 
      });

      return res.status(200).json({ message: 'All signals have been updated successfully' });
  } catch (error) {
      console.error('Error updating all signals:', error);
      return res.status(500).json({ message: 'Error updating signals', error: error.message });
  }
};

exports.getSignalsCount = async (req, res) => {
  try {
      const count = await Signaler.count({
          where: {
              isOpen: false  // Assuming this maps correctly to your database field
          }
      });

      return res.status(200).json({
          message: 'Unresolved signals count retrieved successfully',
          count: count
      });
  } catch (error) {
      console.error('Error fetching unresolved signals count:', error);
      return res.status(500).json({ message: 'Error fetching signals count', error: error.message });
  }
};

//hachtag

exports.getTopHashtags = async (req, res) => {
  try {
    const topHashtags = await Hachtag.findAll({
      attributes: [
        'hachtag',
        [Sequelize.fn('COUNT', Sequelize.col('hachtag')), 'nbr_hachtag']
      ],
      group: ['hachtag'], 
      order: [[Sequelize.literal('nbr_hachtag'), 'DESC']], 
      limit: 6, 
    });

    if (topHashtags.length > 0) {
      res.status(200).json({
        message: "Top hashtags retrieved successfully",
        hashtags: topHashtags.map(tag => ({
          hachtag: tag.hachtag,
          nbr_hachtag: tag.get('nbr_hachtag'),
        }))
      });
    } else {
      res.status(404).json({
        message: "No hashtags found"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving hashtags",
      error: error.message
    });
  }
};

exports.getHashtagsWithPosts = async (req, res) => {
  const userId = req.userId;  // Assume userId is set by your authentication middleware

  try {
    // First, retrieve all hashtags with their counts
    const hashtagCounts = await Hachtag.findAll({
      attributes: [
        'hachtag',
        [Sequelize.fn('COUNT', '*'), 'nbr_hachtag']
      ],
      group: 'hachtag',
      order: [[Sequelize.literal('nbr_hachtag'), 'DESC']], 
      limit: 6,
    });

    // Fetch posts for each hashtag
    const hashtagsWithPosts = await Promise.all(hashtagCounts.map(async tag => {
      const posts = await Hachtag.findAll({
        where: { hachtag: tag.hachtag },
        include: [{
          model: Post,
          as: 'post',
          attributes: ['id_post', 'id_utilisateur', 'contenu', 'type', 'date_post'],  
          include: [{
            model: Utilisateur,
            as: 'utilisateur',
            attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
          }]
        }]
      });

      // Map each hachtag to its posts and include additional details for each post
      const postsWithDetails = await Promise.all(
        posts.map(async (hachtag) => {
          const post = hachtag.post;
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
            include: [{
              model: Utilisateur,
              as: 'utilisateur',
              attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
            }],
          });
          postJson.commentaires = comments;

          // Fetch likes for the post
          const likes = await Likes.findAll({
            where: { id_post: post.id_post },
            include: [{
              model: Utilisateur,
              as: 'utilisateur',
              attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
            }],
          });
          postJson.likesCount = likes.length;
          postJson.likes = likes;

          // Fetch collaborations
          const collabs = await Mention.findAll({
            where: {
              id_post: post.id_post,
            },
            include: [{
              model: Offre,
              as: 'offre',
              attributes: ['id_offre', 'titre'],
              include: [{
                model: Collaborateur,
                as: 'collaborateur',
                attributes: ['id_collaborateur', 'nom'],
              }],
            }],
          });
          postJson.lesCollab = collabs;

          return postJson;
        })
      );

      return {
        hachtag: tag.hachtag,
        nbr_hachtag: tag.get('nbr_hachtag'),
        posts: postsWithDetails  // Now contains a detailed list of posts including images, comments, etc.
      };
    }));

    res.status(200).json({
      message: "Hashtags with related posts retrieved successfully",
      hashtags: hashtagsWithPosts
    });
  } catch (error) {
    console.error('Error retrieving hashtags with posts:', error);
    res.status(500).json({ message: 'Error fetching hashtags with related posts', error: error.message });
  }
};

module.exports = exports;
