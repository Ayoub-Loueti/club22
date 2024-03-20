import React, { useState, useEffect } from 'react';
import './posts.css';

import Post from '../post/post';

const Posts = ({ posts, openModalForPost }) => {
  const [currentPosts, setCurrentPosts] = useState([]);

  useEffect(() => {
    setCurrentPosts([...posts].reverse());
  }, [posts]); // Cette dépendance s'assure que currentPosts est mis à jour lorsque les posts changent.

  const handlePostDeleted = (postId) => {
    const updatedPosts = currentPosts.filter((post) => post.id_post !== postId);
    setCurrentPosts(updatedPosts);
  };
  const handlePostUpdated = (updatedPost) => {
    const updatedPosts = currentPosts.map((post) => {
      if (post.id_post === updatedPost.id_post) {
        return updatedPost; // Remplace le post par sa nouvelle version
      }
      return post;
    });
    setCurrentPosts(updatedPosts);
  };
  return (
    <div className="Posts">
      {currentPosts.map((post) => (
        <Post
          key={post.id_post}
          data={post}
          onPostDeleted={handlePostDeleted}
          onPostUpdated={handlePostUpdated}
          openModalForPost={openModalForPost} // This prop is passed to each Post component
        />
      ))}
    </div>
  );
};

export default Posts;
