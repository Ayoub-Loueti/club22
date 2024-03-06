import React from 'react';
import Posts from '../posts/posts';
import PostShare from '../postShare/postShare';
import './postSide.css';
const PostSide = () => {
  return (
    <div className="PostSide">
      <PostShare />
      <Posts />
    </div>
  );
};

export default PostSide;
