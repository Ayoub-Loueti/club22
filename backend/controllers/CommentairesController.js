const Post  = require('../models/PostModel'); 
const Likes = require('../models/LikesModel'); 
const Utilisateur = require('../models/UtilisateurModel');
const Commentaire = require('../models/CommentairesModel');
const Notification = require('../models/NotificationModel');
const Reponse = require('../models/ReponseModel');
const LikeCom = require('../models/LikeComModel');
const LikeRep = require('../models/LikeRepModel');


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

  // reponses 
  
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

module.exports = exports;
