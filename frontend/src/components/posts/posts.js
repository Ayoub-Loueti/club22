import React, { useState, useEffect } from 'react';
import './posts.css';

import Post from '../post/post';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
const Posts = ({ posts, openModalForPost }) => {
  const [currentPosts, setCurrentPosts] = useState([]);

  useEffect(() => {
    setCurrentPosts([...posts].reverse());
  }, [posts]); 
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage] = useState(8); 
  const handlePostDeleted = (postId) => {
    const updatedPosts = currentPosts.filter((post) => post.id_post !== postId);
    setCurrentPosts(updatedPosts);
  };
  const handlePostUpdated = (updatedPost) => {
    const updatedPosts = currentPosts.map((post) => {
      if (post.id_post === updatedPost.id_post) {
        return updatedPost; 
      }
      return post;
    });
    setCurrentPosts(updatedPosts);
  };

  // Calculer le nombre total de pages
  const pageCount = Math.ceil(currentPosts.length / postsPerPage);

  // Changer la page
  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  const currentDisplayPosts = currentPosts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  );
  return (
    <div className="Posts">
      {currentDisplayPosts.map((post) => (
        <Post
          key={post.id_post}
          data={post}
          onPostDeleted={handlePostDeleted}
          onPostUpdated={handlePostUpdated}
          openModalForPost={openModalForPost}
        />
      ))}
      <ReactPaginate
        previousLabel={<FontAwesomeIcon icon={faCircleChevronLeft} />}
        nextLabel={<FontAwesomeIcon icon={faCircleChevronRight} />}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={changePage}
        containerClassName={'pagination'}
        activeClassName={'active'}
        previousClassName={'pagination-previous'}
        nextClassName={'pagination-next'}
      />
    </div>
  );
};

export default Posts;
