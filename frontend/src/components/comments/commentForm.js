import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ postId }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('login'))?.token;
      await axios.post(
        `http://localhost:5000/post/${postId}/comment`,
        { cmntr: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Handle success (e.g., clear the comment form, fetch the post's comments again)
      setCommentText(''); // Clear the comment text after successful submission
    } catch (error) {
      console.error('Error submitting comment', error);
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={commentText}
        onChange={(event) => setCommentText(event.target.value)}
        placeholder="Write a comment..."
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
