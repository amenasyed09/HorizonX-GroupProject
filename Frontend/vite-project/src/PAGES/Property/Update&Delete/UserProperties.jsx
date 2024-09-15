import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const navigate=useNavigate()
  // Fetch username from cookies
  const username = Cookies.get('username');

  // Fetch properties for the logged-in user
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Log the username and API URL for debugging
        console.log('Fetching properties for:', username);
        const apiUrl = `http://127.0.0.1:8000/api/allProperties/${username}`;
        console.log('API URL:', apiUrl);

        const response = await axios.get(apiUrl);
        console.log('Response:', response);

        setProperties(response.data.properties);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    if (username) {
      fetchProperties();
    } else {
      console.warn('Username is not available');
      setLoading(false);
    }
  }, [username]);

  const handleUpdate=(propertyId)=>
  {
navigate(`/update/${propertyId}`)
  }
  // Show modal for delete confirmation
  const handleDeleteClick = (propertyId) => {
    setPropertyToDelete(propertyId);
    setShowModal(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/deleteProperty/${propertyToDelete}/`);
      setProperties(properties.filter(property => property._id !== propertyToDelete));
      console.log(`Deleted property with id: ${propertyToDelete}`);
    } catch (err) {
      console.error('Error deleting property:', err);
    }
    setShowModal(false);
    setPropertyToDelete(null);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowModal(false);
    setPropertyToDelete(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property._id}
            className="relative bg-white shadow-lg border border-gray-300 p-4 rounded-lg hover:bg-gray-100 transition"
          >
            {/* Property Image */}
            {property.images.length > 0 ? (
              <img
                src={property.images[0]} // Assuming the first image is the main one
                alt={property.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            {/* Property Main Info */}
            <h2 className="text-lg font-bold mb-2">{property.title}</h2>
            <p className="text-gray-700">Price: ${property.price}</p>
            <p className="text-gray-700">Type: {property.property_type}</p>

            {/* Additional Info - Show on hover */}
            <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 bg-black bg-opacity-75 text-white p-4 rounded-lg transition-opacity duration-300 flex flex-col justify-between">
              <div>
                <p>Description: {property.description}</p>
                <p>Bedrooms: {property.bedrooms}</p>
                <p>Bathrooms: {property.bathrooms}</p>
                <p>Square Feet: {property.square_feet}</p>
                <p>Rating: {property.rating}/5</p>
                <p>Amenities: {property.amenities}</p>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleUpdate(property._id)}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteClick(property._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>This will delete the property. Are you sure?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProperties;
