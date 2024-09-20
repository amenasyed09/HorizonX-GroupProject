import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PropertyDetailPage.css';

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = React.useState(null);

  React.useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/property/${propertyId}`);
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  if (!property) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Photo Gallery */}
      <div className="photo-gallery mb-6">
        {property.images && property.images.map((image, index) => (
          <img
            key={index}
            src={`http://127.0.0.1:8000${image}`}
            alt={`Photo ${index + 1}`}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        ))}
      </div>

      {/* Property Details */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">{property.title}</h1>
        <hr />
        <p className="text-gray-600 mb-4">Price: ${property.price}</p>
        <hr />
        <p className="text-gray-600 mb-4">{property.description}</p>
        <hr />
        <p className="text-gray-600 mb-4">Address: {property.address}</p>
        <hr />
        <p className="text-gray-600 mb-4">Bedrooms: {property.bedrooms}</p>
        <p className="text-gray-600 mb-4">Bathrooms: {property.bathrooms}</p>
        <p className="text-gray-600 mb-4">Square Feet: {property.square_feet}</p>
        <hr />
        <p className="text-gray-600 mb-4">Amenities: {property.amenities}</p>
        <p className="text-gray-600 mb-4">Rating: {property.rating}</p>
        <p className="text-gray-600 mb-4">Listing Date: {new Date(property.listing_date).toLocaleDateString()}</p>
      </div>

    </div>
  );
};

export default PropertyDetailPage;
