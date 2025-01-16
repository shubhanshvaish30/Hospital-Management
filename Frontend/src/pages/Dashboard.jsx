import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, FileText, MapPin, Bell, ChevronRight, Plus, X, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    recentRecords: 8,
    nearbyHospitals: 0
  });

  const [healthProfile, setHealthProfile] = useState(null);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    bloodPressure: '',
    bloodGroup: '',
    chronic_Conditions: [''],
    allergies: [''],
    lifeStyle: {
      smoking: false,
      alcohol: false,
    },
    emergencyContact: ''
  });

  const notifications = [
    { title: 'Appointment Reminder', message: 'Dr. Smith tomorrow at 10:00 AM', time: '1h ago' },
    { title: 'Lab Results Available', message: 'Your recent blood test results are ready', time: '3h ago' },
    { title: 'Prescription Refill', message: 'Time to refill your prescription', time: '1d ago' },
  ];

  const storedUser = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    fetchDashboardData();
    fetchHealthProfile();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch upcoming appointments
      const appointmentsResponse = await axios.get(`http://localhost:8080/appoint/user/${storedUser._id}`);
      const upcomingCount = appointmentsResponse.data.appointments.filter(
        apt => new Date(apt.date) > new Date() && apt.status !== 'Cancelled'
      ).length;

      // Fetch nearby hospitals
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const hospitalsResponse = await axios.get(
            'https://hospital-d1nw.onrender.com/get/hospitals/near',
            {
              params: { latitude, longitude, radius: 1000 }
            }
          );
          setStats(prev => ({
            ...prev,
            upcomingAppointments: upcomingCount,
            nearbyHospitals: hospitalsResponse.data.length
          }));
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchHealthProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/health/profile/${storedUser._id}`);
      console.log(response.data.data);
      
      if (response.data.data) {
        setHealthProfile(response.data.data);
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching health profile:', error);
    }
  };
  console.log(healthProfile);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = `http://localhost:8080/health/profile`; // Use a single endpoint for both create and update

      const method = healthProfile ? 'post' : 'post'; // Always use 'POST' because backend handles the logic

      // Prepare the data to be sent to the backend
      const requestData = {
        ...formData,
        userId: storedUser._id,
      };

      console.log("Submitting data...");

      // Send the request to the backend
      const response = await axios[method](endpoint, requestData);

      console.log(response);

      // Handle response from the server
      setHealthProfile(response.data.data); // Set the response data to state
      setShowHealthForm(false); // Close the form after submission
  console.log(healthProfile);
      alert('Health profile saved successfully');
    } catch (error) {
      console.error('Error saving health profile:', error);
      alert('Failed to save health profile. Please try again.');
    }
};


  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {storedUser.name}</h1>
        <p className="text-gray-600">Here's an overview of your health status</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Upcoming Appointments', value: stats.upcomingAppointments, icon: Calendar },
          { label: 'Recent Records', value: stats.recentRecords, icon: FileText },
          { label: 'Nearby Hospitals', value: stats.nearbyHospitals, icon: MapPin },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Health Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Health Overview</h2>
            <button
              onClick={() => {
                setShowHealthForm(true);
                if (!healthProfile) {
                  setFormData({
                    age: '',
                    height: '',
                    weight: '',
                    bloodPressure: '',
                    bloodGroup: '',
                    chronic_Conditions: [''],
                    allergies: [''],
                    lifeStyle: {
                      smoking: false,
                      alcohol: false,
                    },
                    emergencyContact: ''
                  });
                }
              }}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              {healthProfile ? (
                <>
                  <Edit className="w-5 h-5" />
                  <span>Edit Profile</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add Profile</span>
                </>
              )}
            </button>
          </div>
          {healthProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-lg font-semibold">{healthProfile.age} years</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Blood Group</p>
                  <p className="text-lg font-semibold">{healthProfile.bloodGroup}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="text-lg font-semibold">{healthProfile.height} cm</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="text-lg font-semibold">{healthProfile.weight} kg</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Blood Pressure</p>
                  <p className="text-lg font-semibold">{healthProfile.bloodPressure} mmHg</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Emergency Contact</p>
                  <p className="text-lg font-semibold">{healthProfile.emergencyContact}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Chronic Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {healthProfile.chronic_Conditions.map((condition, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {healthProfile.allergies.map((allergy, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Lifestyle</p>
                <div className="flex gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    healthProfile.lifeStyle.smoking 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {healthProfile.lifeStyle.smoking ? 'Smoker' : 'Non-smoker'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    healthProfile.lifeStyle.alcohol 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {healthProfile.lifeStyle.alcohol ? 'Drinks Alcohol' : 'Non-alcoholic'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No health profile available</p>
              <p className="text-sm text-gray-400">Click the button above to add your health profile</p>
            </div>
          )}
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Link
          to="/appointments"
          className="flex items-center justify-between p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Book Appointment</span>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-600" />
        </Link>
        <Link
          to="/records"
          className="flex items-center justify-between p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="font-medium">View Records</span>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-600" />
        </Link>
        <Link
          to="/hospitals"
          className="flex items-center justify-between p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <MapPin className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Find Hospital</span>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-600" />
        </Link>
      </motion.div>

      {/* Health Profile Form Modal */}
      {showHealthForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {healthProfile ? 'Edit Health Profile' : 'Add Health Profile'}
              </h2>
              <button
                onClick={() => setShowHealthForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Pressure (mmHg)
                  </label>
                  <input
                    type="text"
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Chronic Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chronic Conditions
                </label>
                {formData.chronic_Conditions.map((condition, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={condition}
                      onChange={(e) => handleArrayFieldChange('chronic_Conditions', index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.chronic_Conditions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('chronic_Conditions', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('chronic_Conditions')}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Condition</span>
                </button>
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                {formData.allergies.map((allergy, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={allergy}
                      onChange={(e) => handleArrayFieldChange('allergies', index, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.allergies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField('allergies', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('allergies')}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Allergy</span>
                </button>
              </div>

              {/* Lifestyle */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Lifestyle
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.lifeStyle.smoking}
                      onChange={(e) => setFormData({
                        ...formData,
                        lifeStyle: { ...formData.lifeStyle, smoking: e.target.checked }
                      })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Smoking</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.lifeStyle.alcohol}
                      onChange={(e) => setFormData({
                        ...formData,
                        lifeStyle: { ...formData.lifeStyle, alcohol: e.target.checked }
                      })}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Alcohol</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowHealthForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {healthProfile ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;