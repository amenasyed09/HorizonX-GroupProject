import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Navigate, useNavigate } from 'react-router-dom';

export default function PropertyForm1() {
  const navigate=useNavigate()
  const [images, setImages] = useState([]);
  const [propertyData, setPropertyData] = useState({
    title: '',
    description: '',
    price: '',
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    listing_date: '',
    amenities: '',
    rating: '',
    address: '',
    city: '',
    state: '',
    country: '',
    user: Cookies.get('username'),
    saleType: 'sell',
    stories: '',
    main_road: '',
    guest_room: '',
    basement: '',
    hotwater_heating: '',
    airconditioning: '',
    parking: '',
    prefarea: '',
  });

  const [isRent, setIsRent] = useState(false);

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaleTypeChange = (e) => {
    const value = e.target.value;
    setPropertyData((prev) => ({ ...prev, saleType: value }));
    setIsRent(value === 'rent');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    images.forEach((image) => {
      formData.append('images', image);
    });

    for (const key in propertyData) {
      formData.append(key, propertyData[key]);
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/newProperty/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status == 200) {
        const modelRedirecting = async () => {
          
          Cookies.set('model_params', response.data.priceHelp)
          
          console.log(response.data.property_data);
          Cookies.set('data', JSON.stringify(response.data.property_data));
          navigate("/pricehelp")
        }
        modelRedirecting()
      }else if(response.status == 201){
          navigate("/")
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      alert('Failed to submit property');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-100 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Submit Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={propertyData.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            name="description"
            value={propertyData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        {/* Sale Type (Rent or Sell) */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Sale Type</label>
          <select
            name="saleType"
            value={propertyData.saleType}
            onChange={handleSaleTypeChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          >
            <option value="sell">Sell</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        {/* Price Field */}
        {isRent?(<div>
          <label className="block text-gray-700 font-bold mb-2">Price</label>
          <div className="flex items-center">
            <input
              type="number"
              name="price"
              value={propertyData.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              required
            />
            {/* Show "/per month" when "Rent" is selected */}
            {isRent && <span className="ml-2 text-gray-500">/per month</span>}
          </div>
        </div>):(<></>)}
        

        {/* Other fields */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Property Type</label>
          <input
            type="text"
            name="property_type"
            value={propertyData.property_type}
            onChange={handleInputChange}
            placeholder="Property Type"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Bedrooms</label>
          <input
            type="number"
            name="bedrooms"
            value={propertyData.bedrooms}
            onChange={handleInputChange}
            placeholder="Bedrooms"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Bathrooms</label>
          <input
            type="number"
            name="bathrooms"
            value={propertyData.bathrooms}
            onChange={handleInputChange}
            placeholder="Bathrooms"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Square Feet</label>
          <input
            type="number"
            name="square_feet"
            value={propertyData.square_feet}
            onChange={handleInputChange}
            placeholder="Square Feet"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Listing Date</label>
          <input
            type="date"
            name="listing_date"
            value={propertyData.listing_date}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Amenities</label>
          <input
            type="text"
            name="amenities"
            value={propertyData.amenities}
            onChange={handleInputChange}
            placeholder="Amenities"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Rating</label>
          <input
            type="number"
            name="rating"
            value={propertyData.rating}
            onChange={handleInputChange}
            placeholder="Rating"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={propertyData.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">City</label>
          <input
            type="text"
            name="city"
            value={propertyData.city}
            onChange={handleInputChange}
            placeholder="City"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">State</label>
          <input
            type="text"
            name="state"
            value={propertyData.state}
            onChange={handleInputChange}
            placeholder="State"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Country</label>
          <input
            type="text"
            name="country"
            value={propertyData.country}
            onChange={handleInputChange}
            placeholder="Country"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            required
          />
        </div>

        {/* File input for uploading images */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* stories */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Stories</label>
          <input
            type="number"
            name="stories"
            value={propertyData.stories}
            onChange={handleInputChange}
            placeholder="floor"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>

        {/* main road */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Main Road</label>
          <input
            type="number"
            name="main_road"
            value={propertyData.main_road}
            onChange={handleInputChange}
            placeholder="Main road (0 or 1)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>
        {/* guest room */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Guest Room</label>
          <input
            type="number"
            name="guest_room"
            value={propertyData.guest_room}
            onChange={handleInputChange}
            placeholder="Guest Room (0 or 1)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>
        {/* basement */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Basement</label>
          <input
            type="number"
            name="basement"
            value={propertyData.basement}
            onChange={handleInputChange}
            placeholder="Basement (0 or 1)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>
        {/* Hot water heating */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Hot Water heating</label>
          <input
            type="number"
            name="hotwater_heating"
            value={propertyData.hotwater_heating}
            onChange={handleInputChange}
            placeholder="hot water available (0 or 1)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>
        {/* AC */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Air Conditioning</label>
          <input
            type="number"
            name="airconditioning"
            value={propertyData.airconditioning}
            onChange={handleInputChange}
            placeholder="AC available (0 or 1)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>
        {/* Parking */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Parking</label>
          <input
            type="number"
            name="parking"
            value={propertyData.parking}
            onChange={handleInputChange}
            placeholder="Parking available (0 or 1)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>
        {/* Prefarea */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Prefarea</label>
          <input
            type="number"
            name="prefarea"
            value={propertyData.prefarea}
            onChange={handleInputChange}
            placeholder="prefarea available (0 or 1)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none"
        >
          Upload Property
        </button>
      </form>
    </div>
  );
}
