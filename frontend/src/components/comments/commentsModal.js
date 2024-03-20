import React from 'react';
import Modal from 'react-modal';

const CommentsModal = ({ isOpen, onRequestClose, post }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>All Comments</h2>
      {post?.comments?.length > 0 ? ( // Safely accessing `comments` using optional chaining and checking its length
        post.comments.map((comment) => (
          <div key={comment.id}>
            {/* Your rendering logic here */}
            {comment.text}
            {comment.reponses?.map(
              (
                reply // Also safely accessing `reponses` with optional chaining
              ) => (
                <div key={reply.id}>{reply.text}</div>
              )
            )}
          </div>
        ))
      ) : (
        <p>No comments to display.</p> // Providing a fallback UI
      )}
    </Modal>
  );
};

export default CommentsModal;
