import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ImageUpdateForm = () => {
  const { propertyId } = useParams();
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  useEffect(() => {

    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/property/${propertyId}`);
        setExistingImages(response.data.images || []);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [propertyId]);
  const handleFileChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleRemoveImage = (image) => {
    setRemovedImages([...removedImages, image]);
    setExistingImages(existingImages.filter((img) => img !== image));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      for (let i = 0; i < newImages.length; i++) {
        formData.append('images', newImages[i]);
      }
      if (removedImages.length > 0) {
        formData.append('removedImages', JSON.stringify(removedImages));
      }
      for (let [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? value.name : value);
      }
 
      await axios.patch(`http://127.0.0.1:8000/api/updatePropertyImages/${propertyId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Images updated successfully');
    } catch (error) {
      console.error('Error updating images:', error);
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">Existing Images</label>
          <div className="flex flex-wrap gap-4">
            {existingImages.length > 0 ? (
              existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={`http://127.0.0.1:8000${image}`} alt={`Property Image ${index + 1}`} className="w-full h-auto border border-gray-300 rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                    className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-sm rounded hover:bg-gray-700"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No images available</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">New Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Update Images
        </button>
      </form>
    </div>
  );
};

export default ImageUpdateForm;
