import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import homeImage from '../../assets/hero.png';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Range } from 'react-range';

export default function Hero({ onFiltered }) {
  const [destination, setDestination] = useState('');
  const [promotionType, setPromotionType] = useState('all'); // 'all', 'promo', 'nonpromo'
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [prices, setPrices] = useState([minPrice, maxPrice]);
  const token = localStorage.getItem('login');
  const { t } = useTranslation();

  const normalizeImagePath = (path) => {
    return path.replace(/\\/g, '/');
  };
  const fetchFilteredOffers = async (prices, destination, promotionType) => {
    try {
      const response = await axios.get('http://54.87.28.4/employeOffers', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token).token}`,
        },
      });
      let filtered = response.data
        .filter((offre) => {
          const priceMatch = offre.prix >= prices[0] && offre.prix <= prices[1];
          const destinationMatch = destination
            ? offre.destination
                .toLowerCase()
                .includes(destination.toLowerCase())
            : true;
          let promotionMatch = true;
          if (promotionType === 'promo') {
            promotionMatch = offre.remise > 0;
          } else if (promotionType === 'nonpromo') {
            promotionMatch = offre.remise === 0;
          }
          return priceMatch && destinationMatch && promotionMatch;
        })
        .map((offre) => ({
          ...offre,
          lesImages: offre.lesImages.map((img) => ({
            ...img,
            image: normalizeImagePath(img.image),
          })),
          currentImageIndex: 0,
        }));
      onFiltered(filtered);
    } catch (error) {
      console.error('Error fetching offres:', error);
    }
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('http://54.87.28.4/employeOffers', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
        const allPrices = response.data.map((offre) => offre.prix);
        setMinPrice(Math.min(...allPrices));
        setMaxPrice(Math.max(...allPrices));
        setPrices([Math.min(...allPrices), Math.max(...allPrices)]);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };
    fetchPrices();
  }, [token]);

  const handleSearch = () => {
    fetchFilteredOffers(prices, destination, promotionType);
  };

  const handleRangeChange = (values) => {
    setPrices(values);
  };

  const handleDestinationChange = (event) => {
    const value = event.target.value;
    setDestination(value);
  };

  const handlePromotionTypeChange = (event) => {
    const value = event.target.value;
    setPromotionType(value);
  };

  return (
    <Section id="hero">
      <div className="background">
        <img src={homeImage} alt="" />
      </div>
      <div className="content">
        <div className="title">
          <h1>{t('VOYAGEZ POUR DÉCOUVRIR')}</h1>
          <p>
            {t(
              "En tant qu’adhérent de Club22,vous bénéficiez d'offres exclusives pour réserver votre prochain hôtel, voyage ou activité à un prix imbattable.vous trouverez sans doute l'offre qui correspond à vos envies et à votre budget !"
            )}{' '}
          </p>
        </div>
        <div className="search">
          <div className="container">
            <label htmlFor="">{t('Où voulez-vous aller')}</label>
            <input
              type="text"
              placeholder={t('Votre destination')}
              onChange={handleDestinationChange}
              style={{
                padding: '0.5rem',
                border: '2px solid #232C5F',
                borderRadius: '0.3rem',
                margin: '0.3rem 0',
                width: '100%',
              }}
            />
          </div>
          <div className="price-range">
            <div className="price-line">
              <span className="min-price">{prices[0]} TND</span>
              <Range
                step={1}
                min={minPrice}
                max={maxPrice}
                values={prices}
                onChange={handleRangeChange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '6px',
                      width: '100%',
                      background: 'linear-gradient(to right,#909AD6, #384696)',
                      borderRadius: '5px',
                      borderRadius: '5px',
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '1rem', // Réduire la taille des poignées
                      width: '1rem',
                      backgroundColor: '#384696',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                  />
                )}
              />
              <span className="max-price"> {prices[1]} TND</span>
            </div>
          </div>
          <div className="container">
            <label htmlFor="">Promotion</label>
            <select
              onChange={handlePromotionTypeChange}
              style={{
                padding: '0.8rem',
                border: '2px solid #232C5F',
                borderRadius: '0.3rem',
                margin: '0.5rem 0',
                width: '100%',
                backgroundColor: '#ffffff',
                color: '#000000',
              }}
            >
              <option value="all">{t('Toutes')}</option>
              <option value="promo">{t('Offres promotionnelles')}</option>
              <option value="nonpromo">
                {t('Offres non promotionnelles')}
              </option>
            </select>
          </div>
          <button onClick={handleSearch}>{t('Découvrez')}</button>
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
        font-weight: bold;
      }
    }
    .search {
      display: flex;
      background-color: #ffffffce;
      padding: 0.7rem;
      border-radius: 0.5rem;
      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0 4rem;
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
          background-color: #023e8a;
          color: #000000;
          &:focus {
            outline: none;
          }
        }
      }
      button {
        padding: 0.1rem 0.5rem;
        cursor: pointer;
        border-radius: 0.3rem;
        border: none;
        color: white;
        background-color: #232c5f;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.3s ease-in-out;
        &:hover {
          background-color: #023e8a;
        }
      }
    }
  }

  .price-range {
    width: 50%;
    padding: 0;
    .price-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-top: 3rem;
      padding: 0 0.5rem;
      .min-price,
      .max-price {
        font-size: 0.9rem;
      }
      .min-price {
        margin-right: 1rem; // Ajoutez un espace à droite du prix minimum
      }
      .max-price {
        margin-left: 1rem; // Ajoutez un espace à gauche du prix maximum
      }
      input[type='range'] {
        width: 100%;
        margin: 0 1rem;
        -webkit-appearance: none;
        height: 0.5rem;
        background: linear-gradient(to right, #7481cc, #384696);
        border-radius: 5px;
        outline: none;
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 1.5rem;
          height: 1.5rem;
          background: #232c5f;
          border-radius: 50%;
          cursor: pointer;
        }
        &::-moz-range-thumb {
          width: 1.5rem;
          height: 1.5rem;
          background: #232c5f;
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
