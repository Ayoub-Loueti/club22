import React from 'react';
import './posts.css';

import Post from '../post/post';


const Posts = ({ posts }) => {
    const reversedPosts = [...posts].reverse();

  return (
    <div className="Posts">
      {reversedPosts.map((post, index) => {
        return <Post key={index} data={post} />; // Utiliser Post pour afficher chaque post
      })}
    </div>
  );
};

export default Posts;
