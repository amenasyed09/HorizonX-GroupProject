import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import './HomeSection.css';

const HomeSection = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/properties') 
      .then(response => {
        const allProperties = response.data;
        const randomProperties = allProperties.sort(() => 0.5 - Math.random()).slice(0, 8);
        setProperties(randomProperties);
      })
      .catch(error => {
        console.error("There was an error fetching the properties!", error);
      });
  }, []);

  return (
    <div className="home-section-container">
      <h3 className="section-title">Browse trending properties</h3>
      <div className="home-section-grid">
        {properties.map((property) => (
          <div key={property._id} className="house-block">
            <img 
              src={property.images[0] || '/placeholder.jpg'} 
              alt={property.title} 
              className="house-img"
            />
            <h3 className="house-title">{property.title || 'No Title'}</h3>
            <div className="house-price">${property.price || 'N/A'}</div>
            <div className="house-available">{property.status || 'Unavailable'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeSection;
