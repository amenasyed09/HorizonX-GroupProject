import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaArrowRight } from 'react-icons/fa';
import FilterSidebar from './FilterSidebar';

const PropertyDisplay = () => {
  const [properties, setProperties] = useState([]);
  const { saleType } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    squareFeet: [0, 10000],
    bedrooms: 1,
    bathrooms: 1,
    rating: 1,
    stories: 1,
  });
  const [applyFilters, setApplyFilters] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      const url = searchTerm
        ? `http://127.0.0.1:8000/api/getAllProperties/search/${saleType}/${searchTerm}`
        : `http://127.0.0.1:8000/api/getAllProperties/search/${saleType}/all/`;

      try {
        const response = await axios.get(url);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [searchTerm, saleType]);

  useEffect(() => {
    if (!applyFilters) return;

    const fetchFilteredProperties = async () => {
      const params = {
        squareFeetMin: filters.squareFeet[0],
        squareFeetMax: filters.squareFeet[1],
        bedroomsMax: filters.bedrooms,
        bathroomsMax: filters.bathrooms,
        ratingMax: filters.rating,
        stories: filters.stories,
      };

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/getAllProperties/filters/${saleType}/`,
          { params }
        );
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching filtered properties:', error);
      }
    };

    fetchFilteredProperties();
  }, [filters, applyFilters, saleType]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setApplyFilters(true);
    setFilterSidebarOpen(false);
  };

  const renderAmenities = (amenities) => {
    const amenitiesList = ['Gym', 'Pool', 'Playground'];

    return amenitiesList.map((amenity) =>
      amenities.includes(amenity.toLowerCase()) ? (
        <span
          key={amenity}
          className="inline-block bg-gray-300 text-gray-700 rounded-full px-4 py-1 text-sm mr-2 mb-2"
        >
          {amenity}
        </span>
      ) : null
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      {/* Filter Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg transition-transform duration-300 ${
          filterSidebarOpen ? 'translate-x-0 z-20' : '-translate-x-full'
        }`}
      >
        <FilterSidebar onFilterChange={handleFilterChange} />
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${filterSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-6">
          {/* Search Bar */}
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
          {/* Filter Button */}
          <button
            onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
            className="mt-4 bg-black text-white py-2 px-4 rounded-lg"
          >
            {filterSidebarOpen ? 'Close Filters' : 'Open Filters'}
          </button>
        </div>

        {/* Properties Grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div
                key={property._id}
                className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out bg-white group"
              >
                {/* Property Image */}
                {property.images.length > 0 ? (
                  <img
                    src={`http://127.0.0.1:8000${property.images[0]}`}
                    alt={property.title}
                    className="object-cover w-full h-48"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-600">
                    No Image Available
                  </div>
                )}

                {/* Hover Details */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <div className="text-white text-center">
                    <p className="mt-2">Price: {property.price}</p>
                    <p className="mt-2">
                      Bedrooms: {property.bedrooms}, Bathrooms: {property.bathrooms}
                    </p>
                    <p className="mt-2">Square Feet: {property.square_feet}</p>
                    <p className="mt-2">Amenities: {renderAmenities(property.amenities)}</p>
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold">{property.title}</h3>
                  <p className="text-gray-600">Price: {property.price}</p>
                  <p className="text-gray-600">
                    Location: {property.address}, {property.city}, {property.state}, {property.country}
                  </p>
                  <p className="text-gray-600">Rating: {property.rating}</p>
                  <p className="text-gray-600">Stories: {property.stories}</p>

      
                  <Link
                    to={`/property/${property._id}`}
                    className="absolute bottom-4 left-4 bg-black text-white px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2"
                  >
                    <span>View</span>
                    <FaArrowRight className="group-hover:ml-2 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No properties found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDisplay;
