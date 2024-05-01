// StarRating.js
import React from 'react';
import './StarRating.css'; // Ensure this file exists and is correctly linked

const StarRating = ({ rating, numReviews }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="star-rating-container">
      <div className="star-rating">
        {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fa fa-star checked"></i>)}
        {halfStar === 1 && <i key="half" className="fa fa-star-half-o checked"></i>}
        {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="fa fa-star"></i>)}
      </div>
      {numReviews > 0 && <span className="reviews-count"> | {numReviews} Evaluations</span>}
    </div>
  );
};

export default StarRating;
