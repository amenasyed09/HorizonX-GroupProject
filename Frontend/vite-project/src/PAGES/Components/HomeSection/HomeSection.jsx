import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
        <Link 
          to={`/property/${property._id}`} 
          key={property._id}
          className="block" // Ensure the Link is a block-level element
        >
          <div className="house-block bg-white shadow-lg rounded-lg overflow-hidden">
            <img 
              src={`http://127.0.0.1:8000${property.images[0]}` || '/placeholder.jpg'} 
              alt={property.title || 'Property Image'} 
              className="house-img object-cover w-full h-48" 
            />
            <h3 className="house-title text-lg font-bold p-4">{property.title || 'No Title'}</h3>
            <div className="house-price text-gray-800 p-4">${property.price || 'N/A'}</div>
          </div>
        </Link>
      ))}
      </div>
    </div>
  );
};

export default HomeSection;
