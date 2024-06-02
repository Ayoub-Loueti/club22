import React, { useState, useEffect } from 'react';
import './trendCard.css';
import axios from 'axios'; // Ensure axios is installed

const TrendCard = () => {
  const [trends, setTrends] = useState([]); // State to store the fetched hashtags

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await axios.get('http://54.87.28.4/tophashtags');
        setTrends(response.data.hashtags);
      } catch (error) {
        console.error('Error fetching trend data:', error);
      }
    };

    fetchTrends();
  }, []);

  return (
    <div className="TrendCard">
      <h3>Trends for you</h3>
      {trends.map((trend, index) => (
        <div className="trend" key={trend.id_hachtag || index}>
          <span>#{trend.hachtag}</span>
          <span>{trend.nbr_hachtag} partage(s)</span>
        </div>
      ))}
    </div>
  );
};

export default TrendCard;
