import React, { useState,useEffect } from 'react';
import styled from 'styled-components';
import homeImage from '../../assets/hero.png';
import axios from 'axios';
export default function Hero({ onFiltered }) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(11000);
  
  const [destination, setDestination] = useState('');
  const [promotionType, setPromotionType] = useState('all'); // 'all', 'promo', 'nonpromo'
  const [filteredOffres, setFilteredOffres] = useState([]);
  const token = localStorage.getItem('login');


const normalizeImagePath = (path) => {
  return path.replace(/\\/g, '/');
};

const fetchFilteredOffers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/employeOffers', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token).token}`,
      },
    });
    let filtered = response.data
      .filter(
        (offre) =>
          offre.prix >= minPrice &&
          offre.prix <= maxPrice &&
          (!destination ||
            offre.destination
              .toLowerCase()
              .includes(destination.toLowerCase())) &&
          (promotionType === 'all' ||
            (promotionType === 'promo' && offre.remise > 0) ||
            (promotionType === 'nonpromo' && offre.remise === 0))
      )
      .map((offre) => ({
        ...offre,
        lesImages: offre.lesImages.map((img) => ({
          ...img,
          image: normalizeImagePath(img.image),
        })),
        currentImageIndex: 0, // Assurez-vous que chaque offre a un index d'image initialisé
      }));
    onFiltered(filtered);
  } catch (error) {
    console.error('Error fetching offres:', error);
  }
};
  const handlePriceChange = (event) => {
    const value = parseInt(event.target.value);
    setMinPrice(value);
    setMaxPrice(value + 50); // Change the default range as needed
  };

  const handleDestinationChange = (event) => {
    const value = event.target.value;
    setDestination(value);
  };

  const handlePromotionTypeChange = (event) => {
    const value = event.target.value;
    setPromotionType(value);
  };

  const handleSearch = () => {
    fetchFilteredOffers();
  };
  return (
    <Section id="hero">
      <div className="background">
        <img src={homeImage} alt="" />
      </div>
      <div className="content">
        <div className="title">
          <h1>VOYAGEZ POUR DÉCOUVRIR</h1>
          <p>
            Partez à la découverte de destinations uniques et vivez des
            expériences inoubliables. Explorez des cultures fascinantes et créez
            des souvenirs mémorables.
          </p>
        </div>
        <div className="search">
          <div className="container">
            <label htmlFor="">Où voulez-vous aller</label>
            <input
              type="text"
              placeholder="Recherchez votre destination"
              onChange={handleDestinationChange}
            />
          </div>
          <div className="container price-range">
            <label htmlFor="">Plage de prix</label>
            <div className="price-line">
              <span className="min-price">{minPrice} TND</span>
              <input
                type="range"
                min="0"
                max="11000"
                step="50"
                value={minPrice}
                onChange={handlePriceChange}
              />
              <span className="max-price">{maxPrice} TND</span>
            </div>
          </div>
          <div className="container">
            <label htmlFor="">Promotion</label>
            <select onChange={handlePromotionTypeChange}>
              <option value="all">Toutes</option>
              <option value="promo">Offres promotionnelles</option>
              <option value="nonpromo">Offres non promotionnelles</option>
            </select>
          </div>
          <button onClick={handleSearch}>Découvrez</button>
        </div>
      </div>
    </Section>
  );
}

const Section = styled.section`
  position: relative;
  margin-top: 2rem;
  width: 95%;
  height: 95%;

  .background {
    height: 95%;
    margin-left: 5%;
    img {
      width: 95%;
      filter: brightness(60%);
    }
  }
  .content {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 3;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    .title {
      color: white;
      h1 {
        font-size: 3rem;
        letter-spacing: 0.2rem;
      }
      p {
        text-align: center;
        padding: 0 30vw;
        margin-top: 0.5rem;
        font-size: 1.2rem;
      }
    }
    .search {
      display: flex;
      background-color: #ffffffce;
      padding: 0.5rem;
      border-radius: 0.5rem;
      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0 1.5rem;
        label {
          font-size: 1.1rem;
          color: #03045e;
        }
        input {
          background-color: transparent;
          border: none;
          text-align: center;
          color: black;
          &[type='date'] {
            padding-left: 3rem;
          }
        }
        select {
          width: 100%;
          padding: 0.5rem;
          margin-top: 0.5rem;
          border-radius: 0.3rem;
          border: none;
          background-color: #ffffff;
          color: #000000;
          &:focus {
            outline: none;
          }
        }
      }
      button {
        padding: 1rem;
        cursor: pointer;
        border-radius: 0.3rem;
        border: none;
        color: white;
        background-color: #4361ee;
        font-size: 1.1rem;
        text-transform: uppercase;
        transition: 0.3s ease-in-out;
        &:hover {
          background-color: #023e8a;
        }
      }
    }
  }

  .price-range {
    .price-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.5rem;
      .min-price,
      .max-price {
        font-size: 0.9rem;
      }
      input[type='range'] {
        width: 80%;
        margin: 0 1rem;
        -webkit-appearance: none;
        height: 0.5rem;
        background: linear-gradient(to right, #ffbd69, #ff7e67);
        border-radius: 5px;
        outline: none;
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 1.5rem;
          height: 1.5rem;
          background: #4361ee;
          border-radius: 50%;
          cursor: pointer;
        }
        &::-moz-range-thumb {
          width: 1.5rem;
          height: 1.5rem;
          background: #4361ee;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }
  }

  @media screen and (min-width: 280px) and (max-width: 980px) {
    height: 25rem;
    .background {
      background-color: palegreen;
      img {
        height: 100%;
      }
    }
    .content {
      .title {
        h1 {
          font-size: 1rem;
        }
        p {
          font-size: 0.8rem;
          padding: 1vw;
        }
      }
      .search {
        flex-direction: column;
        padding: 0.8rem;
        gap: 0.8rem;
        .container {
          padding: 0 0.8rem;
          input[type='date'] {
            padding-left: 1rem;
          }
        }
        button {
          padding: 1rem;
          font-size: 1rem;
        }
      }
    }
  }
`;
