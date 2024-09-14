import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const initialCenter = { lat: 20.5937, lng: 78.9629 }; // Default to India

export default function CoordinatesMap() {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [position, setPosition] = useState(initialCenter);
  const [markerPosition, setMarkerPosition] = useState(initialCenter);
  const [draggable, setDraggable] = useState(false);
  const [propertyData, setPropertyData] = useState(useLocation().state?.formData || {});
  const markerRef = useRef(null);
  const navigate = useNavigate();

  const fetchCoordinates = async () => {
    const fullAddress = `${address}, ${city}, ${state}, ${country}`;
    try {
      const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=pk.eyJ1IjoiYW1lbmEwNiIsImEiOiJjbTEwd3Nld2Ewa2NqMmxzODJkcHl0N3I2In0.u5AYfHU9-kyFUYNCTgrKlQ`);
      const data = result.data.features[0];
      if (data) {
        const coords = { lat: data.geometry.coordinates[1], lng: data.geometry.coordinates[0] };
        setPosition(coords);
        setMarkerPosition(coords);
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error);
    }
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const newLatLng = marker.getLatLng();
          setMarkerPosition(newLatLng);
        }
      },
    }),
    []
  );

  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  const handleSubmit = async () => {
    try {
      const updatedPropertyData = { ...propertyData, latitude: markerPosition.lat, longitude: markerPosition.lng, address: `${address}, ${city}, ${state}, ${country}` };
      const form = new FormData();
      Object.keys(updatedPropertyData).forEach((key) => {
        form.append(key, updatedPropertyData[key]);
      });
      await axios.post('http://127.0.0.1:8000/api/newProperty/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Property submitted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error submitting property:', error);
      alert('Failed to submit property');
    }
  };

  return (
    <div>
      <div className="p-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="p-2 border border-gray-300 rounded-lg mb-2 w-full"
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="p-2 border border-gray-300 rounded-lg mb-2 w-full"
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          className="p-2 border border-gray-300 rounded-lg mb-2 w-full"
        />
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          className="p-2 border border-gray-300 rounded-lg mb-4 w-full"
        />
        <button
          onClick={fetchCoordinates}
          className="bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200"
        >
          Search Address
        </button>
      </div>
      <MapContainer center={position} zoom={13} style={{ height: '500px', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          draggable={draggable}
          eventHandlers={eventHandlers}
          position={markerPosition}
          ref={markerRef}
        >
          <Popup minWidth={90}>
            <span onClick={toggleDraggable}>
              {draggable
                ? 'Marker is draggable'
                : 'Click here to make marker draggable'}
            </span>
            <br />
            <strong>Address:</strong> {`${address}, ${city}, ${state}, ${country}`}
            <br />
            <strong>Latitude:</strong> {markerPosition.lat}
            <br />
            <strong>Longitude:</strong> {markerPosition.lng}
          </Popup>
        </Marker>
      </MapContainer>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200"
      >
        Submit Property
      </button>
    </div>
  );
}
