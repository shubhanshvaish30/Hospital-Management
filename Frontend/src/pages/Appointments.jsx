import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, MapPin, Plus, X } from "lucide-react";
import axios from "axios";

const Appointments = () => {
  const storedUser = JSON.parse(localStorage.getItem('userData'));
  
  const [appointments, setAppointments] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [formData, setFormData] = useState({
    doctor: "",
    date: "",
    time: "",
    reason: "",
  });
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const fetchHospitals = async () => {
    try {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const radius = 1000;
  
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
          setHospitals(
            response.data.map((hospital) => ({
              id: hospital._id,
              name: hospital.name,
              doctors: hospital.specialities.map((speciality) => ({
                id: speciality._id,
                name: speciality["doctor name"],
                specialty: speciality.speciality,
              })),
            }))
          );
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to fetch location. Please enable location access.");
        }
      );
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const handleHospitalChange = (hospitalId) => {
    const selectedHospital = hospitals.find((hospital) => hospital.id === hospitalId);
    setFormData({ ...formData, hospital: hospitalId, doctor: "" });
    setDoctors(selectedHospital?.doctors || []);
  };
  
  const openBookingModal = () => {
    fetchHospitals();
    setShowBooking(true);
  };
  
  const userId = storedUser._id;

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/appoint/user/${userId}`);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
  
    const { hospital, doctor, date, time, reason } = formData;
    if (!hospital || !doctor || !date || !time || !reason) {
      alert("All fields are required");
      return;
    }
  
    const selectedHospital = hospitals.find((h) => h.id === hospital);
    const selectedDoctor = doctors.find((d) => d.id === doctor);
  
    if (!selectedHospital || !selectedDoctor) {
      alert("Invalid hospital or doctor selection");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8080/appoint/schedule", {
        userId,
        hospital: selectedHospital.name,
        doctor: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        disease: reason,
        date: `${date}T${time}`,
      });
  
      setAppointments([...appointments, response.data.appointment]);
      setShowBooking(false);
      setFormData({ doctor: "", date: "", time: "", reason: "" });
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };
  
  const handleCancelAppointment = async (appointment) => {
    try {
      await axios.patch(`http://localhost:8080/appoint/cancel/${appointment._id}`);
      setAppointments(
        appointments.map((appt) =>
          appt.id === appointment._id ? { ...appt, status: "Cancelled" } : appt
        )
      );
    } catch (error) {
      console.error("Error canceling appointment:", error);
    }
  };

  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
  });

  const openRescheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    // Set current appointment date and time as default values
    const appointmentDate = new Date(appointment.date);
    setRescheduleData({
      date: appointmentDate.toISOString().split('T')[0],
      time: appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    });
    setShowReschedule(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    
    const { date, time } = rescheduleData;
    const newDate = `${date}T${time}`;

    try {
      const response = await axios.patch(
        `http://localhost:8080/appoint/reschedule/${selectedAppointment._id}`,
        { newDate }
      );

      setAppointments(
        appointments.map((appt) =>
          appt._id === selectedAppointment._id ? response.data.appointment : appt
        )
      );

      setShowReschedule(false);
      setSelectedAppointment(null);
      setRescheduleData({ date: "", time: "" });
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      alert("Failed to reschedule appointment. Please try again.");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sortAppointments = (appts) => {
    return appts.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const filterAppointments = () => {
    const now = new Date();
    const filtered = {
      upcoming: [],
      expired: [],
      cancelled: []
    };

    appointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.date);
      if (appointment.status === "Cancelled") {
        filtered.cancelled.push(appointment);
      } else if (appointmentDate < now) {
        filtered.expired.push(appointment);
      } else {
        filtered.upcoming.push(appointment);
      }
    });

    return {
      upcoming: sortAppointments(filtered.upcoming),
      expired: sortAppointments(filtered.expired),
      cancelled: sortAppointments(filtered.cancelled)
    };
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (showBooking) {
      fetchHospitals();
    }
  }, [showBooking]);

  const filteredAppointments = filterAppointments();

  const renderAppointmentCard = (appointment, index) => (
    <motion.div
      key={appointment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {appointment.doctor}
          </h3>
          <p className="text-gray-600">{appointment.disease}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            appointment.status === "Upcoming"
              ? "bg-blue-100 text-blue-800"
              : appointment.status === "Cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {appointment.status}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-3 text-gray-600">
          <Calendar className="w-5 h-5" />
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-600">
          <Clock className="w-5 h-5" />
          <span>{formatTime(appointment.date)}</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-600">
          <MapPin className="w-5 h-5" />
          <span>{appointment.hospital}</span>
        </div>
      </div>
      {activeTab === 'upcoming' && (
        <div className="mt-4 flex space-x-3">
          <button
            onClick={() => openRescheduleModal(appointment)}
            className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Reschedule
          </button>
          <button
            onClick={() => handleCancelAppointment(appointment)}
            className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8 pt-20"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage your healthcare appointments</p>
        </div>
        <button
          onClick={openBookingModal}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Upcoming ({filteredAppointments.upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab('expired')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'expired'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Expired ({filteredAppointments.expired.length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'cancelled'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Cancelled ({filteredAppointments.cancelled.length})
        </button>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredAppointments[activeTab].length > 0 ? (
          filteredAppointments[activeTab].map((appointment, index) =>
            renderAppointmentCard(appointment, index)
          )
        ) : (
          <p className="text-gray-600">No {activeTab} appointments</p>
        )}
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 pt-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Book Appointment</h2>
              <button
                onClick={() => setShowBooking(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleBookAppointment}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Hospital
                </label>
                <select
                  value={formData.hospital}
                  onChange={(e) => handleHospitalChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a hospital</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Doctor
                </label>
                <select
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBooking(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      {showReschedule && selectedAppointment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Reschedule Appointment</h2>
              <button
                onClick={() => setShowReschedule(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Date and Time
                </label>
                <p className="text-gray-600">
                  {formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.date)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) =>
                    setRescheduleData({ ...rescheduleData, date: e.target.value })
                  }
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Time
                </label>
                <input
                  type="time"
                  value={rescheduleData.time}
                  onChange={(e) =>
                    setRescheduleData({ ...rescheduleData, time: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReschedule(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Appointments;