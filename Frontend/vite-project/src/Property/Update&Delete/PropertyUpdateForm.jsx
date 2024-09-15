import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PropertyUpdateForm = () => {
  const { propertyId } = useParams(); // Access route parameter
  const navigate = useNavigate();
  const [property, setProperty] = useState({
    title: '',
    price: '',
    property_type: '',
    description: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    rating: '',
    amenities: '',
    images: [] // Array for images
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch property details by propertyId
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/property/${propertyId}`);
        setProperty(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.message || 'An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result=await axios.put(`http://127.0.0.1:8000/api/updateProperty/${propertyId}/`, property);
      navigate('/userProperties'); // Redirect after successful update
    } catch (err) {
      console.error('Error updating property:', err);
      setError(err.message || 'An unexpected error occurred');
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty(prevState => ({ ...prevState, [name]: value }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Debug: Log images array
  console.log('Property Images:', property.images);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Update Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col md:flex-row">
        {/* Form Fields */}
        <div className="flex-1 md:mr-4">
          {/* Title Input */}
          <div>
            <label className="block text-gray-700">Title:</label>
            <input
              type="text"
              name="title"
              value={property.title}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-gray-700">Price:</label>
            <input
              type="number"
              name="price"
              value={property.price}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Property Type Input */}
          <div>
            <label className="block text-gray-700">Type:</label>
            <input
              type="text"
              name="property_type"
              value={property.property_type}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-gray-700">Description:</label>
            <textarea
              name="description"
              value={property.description}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Bedrooms Input */}
          <div>
            <label className="block text-gray-700">Bedrooms:</label>
            <input
              type="number"
              name="bedrooms"
              value={property.bedrooms}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Bathrooms Input */}
          <div>
            <label className="block text-gray-700">Bathrooms:</label>
            <input
              type="number"
              name="bathrooms"
              value={property.bathrooms}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Square Feet Input */}
          <div>
            <label className="block text-gray-700">Square Feet:</label>
            <input
              type="number"
              name="square_feet"
              value={property.square_feet}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Rating Input */}
          <div>
            <label className="block text-gray-700">Rating:</label>
            <input
              type="number"
              name="rating"
              value={property.rating}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Amenities Input */}
          <div>
            <label className="block text-gray-700">Amenities:</label>
            <input
              type="text"
              name="amenities"
              value={property.amenities}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Images Input */}
          <div>
            <label className="block text-gray-700">Images (comma-separated URLs):</label>
            <input
              type="text"
              name="images"
              value={property.images.join(', ')} // Join array to string
              onChange={(e) => setProperty({ ...property, images: e.target.value.split(',').map(url => url.trim()) })}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
        </div>

        {/* Image Display Section */}
        <div className="flex-none md:w-1/3">
          <div className="mb-4">
            {property.images.length > 0 ? (
              <img
                src={property.images[0]} // Display first image
                alt="Property"
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => alert('Update Image functionality needs to be implemented')}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Update Image
          </button>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 mt-4"
        >
          Update Property
        </button>
      </form>
    </div>
  );
};

export default PropertyUpdateForm;
