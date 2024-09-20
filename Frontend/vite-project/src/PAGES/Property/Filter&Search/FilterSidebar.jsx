import React, { useState } from 'react';

const FilterSidebar = ({ onFilterChange }) => {
  const [squareFeet, setSquareFeet] = useState([0, 10000]); // Two value range
  const [bedrooms, setBedrooms] = useState(1); // Single value
  const [bathrooms, setBathrooms] = useState(1); // Single value
  const [rating, setRating] = useState(1); // Single value
  const [stories, setStories] = useState(1); 

  const handleApplyFilters = () => {
    const filters = {
      squareFeet,
      bedrooms,
      bathrooms,
      rating,
      stories, // Add stories to filters
    };

    console.log('Applying filters:', filters); // Debugging line

    onFilterChange(filters); // Pass filters to parent component
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white text-black shadow-lg p-4">
      <h3 className="text-sm font-semibold mb-3">Filters</h3>

      {/* Square Feet Filter */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold mb-1">Square Feet</h4>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="10000"
            value={squareFeet[0]}
            onChange={(e) => setSquareFeet([Number(e.target.value), squareFeet[1]])}
            className="absolute top-0 left-0 w-full bg-black appearance-none h-1"
            style={{ zIndex: 1 }}
          />
          <input
            type="range"
            min="0"
            max="10000"
            value={squareFeet[1]}
            onChange={(e) => setSquareFeet([squareFeet[0], Number(e.target.value)])}
            className="w-full bg-black appearance-none h-1"
            style={{ position: 'relative', zIndex: 2 }}
          />
        </div>
        <p className="text-xs">{squareFeet[0]} - {squareFeet[1]} sqft</p>
      </div>

      {/* Bedrooms Filter */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold mb-1">Bedrooms</h4>
        <input
          type="number"
          min="1"
          max="10"
          value={bedrooms}
          onChange={(e) => setBedrooms(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg p-1 text-xs"
        />
        <p className="text-xs">{bedrooms} bedrooms</p>
      </div>

      {/* Bathrooms Filter */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold mb-1">Bathrooms</h4>
        <input
          type="number"
          min="1"
          max="10"
          value={bathrooms}
          onChange={(e) => setBathrooms(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg p-1 text-xs"
        />
        <p className="text-xs">{bathrooms} bathrooms</p>
      </div>

      {/* Rating Filter */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold mb-1">Rating</h4>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg p-1 text-xs"
        />
        <p className="text-xs">{rating} stars</p>
      </div>

      {/* Stories Filter */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold mb-1">Stories</h4>
        <input
          type="number"
          min="1"
          max="100"
          value={stories}
          onChange={(e) => setStories(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg p-1 text-xs"
        />
        <p className="text-xs">{stories} stories</p>
      </div>

      <button
        onClick={handleApplyFilters}
        className="w-full bg-black text-white py-1 rounded-lg text-xs"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
