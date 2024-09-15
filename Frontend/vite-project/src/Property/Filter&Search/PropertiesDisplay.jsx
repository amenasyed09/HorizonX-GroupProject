import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import FilterSidebar from './FilterSidebar';

const PropertyDisplay = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    squareFeet: [0, 10000],
    amenities: {
      gym: false,
      pool: false,
      playground: false,
    },
    bedrooms: 1,
    bathrooms: 1,
    rating: 1,
  });
  const [applyFilters, setApplyFilters] = useState(false); // State to control filter fetching

  // Fetch properties when searchTerm changes
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('Fetching based on searchTerm');
        const url = searchTerm
          ? `http://127.0.0.1:8000/api/getAllProperties/search/${searchTerm}`
          : 'http://127.0.0.1:8000/api/getAllProperties/search/all/';

        const response = await axios.get(url);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [searchTerm]);

  // Apply filters when filters change and applyFilters is true
  useEffect(() => {
    if (!applyFilters) return; // Only run this effect if applyFilters is true

    const fetchFilteredProperties = async () => {
      try {
        console.log('Fetching based on filters');
        const params = {
          squareFeetMin: filters.squareFeet[0],
          squareFeetMax: filters.squareFeet[1],
          bedroomsMax: filters.bedrooms,
          bathroomsMax: filters.bathrooms,
          ratingMax: filters.rating,
          amenities: Object.keys(filters.amenities).filter((key) => filters.amenities[key]),
        };

        const response = await axios.get('http://127.0.0.1:8000/api/getAllProperties/filters/', { params });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching filtered properties:', error);
      }
    };

    fetchFilteredProperties();
  }, [filters, applyFilters]);

  // Handle filter changes from FilterSidebar
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setApplyFilters(true); // Set applyFilters to true when filters are applied
    setFilterSidebarOpen(false); // Close the sidebar after applying filters
  };

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ${
          filterSidebarOpen ? 'translate-x-0 z-20' : '-translate-x-full'
        }`}
        style={{ zIndex: filterSidebarOpen ? 20 : 'auto' }}
      >
        <FilterSidebar onFilterChange={handleFilterChange} />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${filterSidebarOpen ? 'ml-64' : 'ml-0'}`}
        style={{ marginLeft: filterSidebarOpen ? '16rem' : '0' }}
      >
        {/* Search Bar */}
        <div className="p-6">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
          </div>
          <button
            onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
            className="mt-4 bg-black text-white py-2 px-4 rounded-lg"
          >
            {filterSidebarOpen ? 'Close Filters' : 'Open Filters'}
          </button>
        </div>

        {/* Property Cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out bg-white"
            >
              <img
                src={property.images[0]} // Display the first image from the images array
                alt={property.title}
                className="object-cover w-full h-48"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <div className="text-white text-center">
                  <p className="mt-2">Price: {property.price}</p>
                  <p className="mt-2">
                    Bedrooms: {property.bedrooms}, Bathrooms: {property.bathrooms}
                  </p>
                  <p className="mt-2">Square Feet: {property.square_feet}</p>
                  <p className="mt-2">Amenities: {property.amenities}</p>
                 
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{property.title}</h3>
                <p className="text-gray-600">Price: {property.price}</p>
                <p className="text-gray-600">
                  Location: {property.address}, {property.city}, {property.state}, {property.zip_code},{' '}
                  {property.country}
                </p>
                <p className="text-gray-600">Status: {property.status}</p>
                <p className="text-gray-600">Rating: {property.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDisplay;
