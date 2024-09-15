import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    status: '',
    listing_date: '',
    updated_date: '',
    amenities: '',
    rating: '',
    images: [],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      if (name === 'images') {
        setFormData((prev) => ({
          ...prev,
          [name]: Array.from(files) // Convert FileList to array
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'images') {
        formData[key].forEach((file) => form.append('images', file));
      } else {
        form.append(key, formData[key]);
      }
    });

      navigate('/getCoordinates', { state: { formData } });
   
  };

  const validateForm = () => {
    // Simple validation to check if all required fields are filled
    return formData.title && formData.price && formData.property_type && formData.images.length > 0;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-6xl bg-white p-10 rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-4xl text-center font-bold mb-8 text-gray-800">Add New Property</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Text Inputs */}
          {[
            { name: 'title', placeholder: 'Title', type: 'text' },
            { name: 'description', placeholder: 'Description', type: 'textarea' },
            { name: 'price', placeholder: 'Price', type: 'number' },
            { name: 'property_type', placeholder: 'Property Type', type: 'text' },
            { name: 'bedrooms', placeholder: 'Bedrooms', type: 'number' },
            { name: 'bathrooms', placeholder: 'Bathrooms', type: 'number' },
            { name: 'square_feet', placeholder: 'Square Feet', type: 'number' },
            { name: 'status', placeholder: 'Status', type: 'text' },
            { name: 'listing_date', placeholder: 'Listing Date', type: 'datetime-local' },
           
            { name: 'amenities', placeholder: 'Amenities (comma-separated)', type: 'textarea' },
            { name: 'rating', placeholder: 'Rating (0-5)', type: 'number' }
          ].map((input, index) => (
            <div key={index} className="flex flex-col">
              {input.type === 'textarea' ? (
                <textarea
                  name={input.name}
                  value={formData[input.name]}
                  onChange={handleChange}
                  placeholder={input.placeholder}
                  className="p-3 border border-gray-300 rounded-lg resize-none"
                  rows={4}
                />
              ) : (
                <>
                  <label className="mb-2 text-gray-600 font-semibold">{input.placeholder}</label>
                  <input
                    type={input.type}
                    name={input.name}
                    value={formData[input.name]}
                    onChange={handleChange}
                    placeholder={input.placeholder}
                    className="p-3 border border-gray-300 rounded-lg"
                  />
                </>
              )}
            </div>
          ))}

          {/* File Input for Images */}
          <div className="flex flex-col col-span-2">
            <label className="mb-2 text-gray-600 font-semibold">Images</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3"
            />
          </div>

          <button
            type="submit"
            className="col-span-2 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 border border-gray-400"
          >
            Proceed to Coordinates
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
