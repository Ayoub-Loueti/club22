import React from 'react';
import './posts.css';

import Post from '../post/post';


const Posts = ({ posts }) => {
  return (
    <div className="Posts">
      {posts.map((post, index) => {
        return <Post key={index} data={post} />; // Utiliser Post pour afficher chaque post
      })}
    </div>
  );
};

export default Posts;
