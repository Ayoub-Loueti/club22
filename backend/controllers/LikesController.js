const Post  = require('../models/PostModel'); 
const Likes = require('../models/LikesModel'); 
const Utilisateur = require('../models/UtilisateurModel');
const Commentaire = require('../models/CommentairesModel');
const Notification = require('../models/NotificationModel');
const Reponse = require('../models/ReponseModel');
const LikeCom = require('../models/LikeComModel');
const LikeRep = require('../models/LikeRepModel');

//posts

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

// comment

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

// reponse

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
