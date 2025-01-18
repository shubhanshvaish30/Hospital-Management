import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Search } from 'lucide-react';
import L from 'leaflet'; // Import Leaflet
import axios from 'axios'; // Import Axios
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

// Define custom icons
const userIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Replace with your user icon URL
  iconSize: [30, 30],
  iconAnchor: [15, 30], // Anchor the icon properly
});

const hospitalIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1048/1048318.png', // Replace with your hospital icon URL
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const HospitalLocator = () => {
  const [viewState, setViewState] = useState({
    latitude: 27.4924,
    longitude: 77.6737,
    zoom: 15,
  });
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(50000); // Default search radius 5 km

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            zoom: 12,
          });
          // Fetch hospitals using the user's coordinates
          fetchHospitals(position.coords.latitude, position.coords.longitude, radius);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, [radius]); // Re-fetch hospitals when radius changes

  const fetchHospitals = async (latitude, longitude, radius) => {
    try {
      const response = await axios.get(
        'https://hospital-d1nw.onrender.com/get/hospitals/near',
        {
          params: {
            latitude,
            longitude,
            radius,
          },
        }
      );
      console.log(response.data);
      
      setHospitals(response.data); // Assuming the response is an array of hospital data
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="mb-8 pt-10">
        <h1 className="text-3xl font-bold text-gray-900">Find Nearby Hospitals</h1>
        <p className="text-gray-600">Locate healthcare facilities in your area</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search and List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search hospitals..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">Loading hospitals...</div>
            ) : (
              hospitals.map((hospital) => (
                <motion.div
                  key={hospital._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedHospital(hospital);
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{hospital.name}</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{hospital.address.city}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-medium text-sm mb-2">Doctors:</h4>
                    <div className="space-y-2">
                      {hospital.specialities.map((spec, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium">{spec['doctor name']}</p>
                          <p className="text-gray-600">{spec.speciality}</p>
                          <p className="text-gray-600">{spec['contact number']}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-xl shadow-sm h-[600px]">
            <MapContainer
              center={[viewState.latitude, viewState.longitude]}
              zoom={viewState.zoom}
              className="rounded-lg w-full h-full"
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* User's location marker */}
              <Marker
                position={[viewState.latitude, viewState.longitude]}
                icon={userIcon}
              >
                <Popup>You are here!</Popup>
              </Marker>
              {/* Nearby hospitals markers */}
              {hospitals.map((hospital) => (
                <Marker
                  key={hospital._id}
                  position={[hospital.address.latitude, hospital.address.longitude]}
                  icon={hospitalIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedHospital(hospital);
                    },
                  }}
                >
                  <Popup>
                    <div>
                      <h3>{hospital.name}</h3>
                      <p>{hospital.address.city}</p>
                      <div className="mt-2">
                        <p className="font-medium">Specialities:</p>
                        <ul className="list-disc list-inside">
                          {hospital.specialities.map((spec, index) => (
                            <li key={index}>{spec.speciality}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HospitalLocator;
