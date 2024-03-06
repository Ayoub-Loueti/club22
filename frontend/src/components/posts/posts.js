import React from 'react';
import './posts.css';
import { PostsData } from '../data/postsData';
import Post from '../post/post';
const Posts = () => {
  return (
    <div className="Posts">
      {PostsData.map((post, id) => {
        return <Post data={post} id={id} />;
      })}
    </div>
  );
};

export default Posts;
