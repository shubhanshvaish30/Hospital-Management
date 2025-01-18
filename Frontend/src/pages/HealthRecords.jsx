import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, User, ClipboardList } from "lucide-react";
import axios from "axios";

const HealthRecords = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  const userId = user._id;
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([
    { name: "All Records", count: 0, icon: FileText },
    { name: "Test Reports", count: 0, icon: ClipboardList },
    { name: "Prescriptions", count: 0, icon: Calendar },
  ]);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await axios.get("http://localhost:8080/health/records", {
          params: { userId },
        });

        if (response.data.success) {
          const formattedRecords = response.data.data.map((record) => ({
            id: record.id,
            type: record.disease,
            prescription: record.prescription,
            testReport: record.testReport,
            date: new Date(record.date).toLocaleDateString(), // Use the 'date' from API response
            category: "Medical Record",
            icon: FileText,
          }));

          // Sort records by date (newest first)
          formattedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

          setRecords(formattedRecords);

          // Update category counts
          setCategories((prev) => [
            { ...prev[0], count: formattedRecords.length },
            { ...prev[1], count: formattedRecords.filter((r) => r.testReport).length },
            { ...prev[2], count: formattedRecords.filter((r) => r.prescription).length },
          ]);
        }
      } catch (error) {
        console.error("Error fetching health records:", error);
      }
    };

    fetchHealthRecords();
  }, [userId]);

  const handleDownload = (url, type) => {
    window.open(url, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="mb-8 pt-10">
        <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
        <p className="text-gray-600">Access and manage your medical history</p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-gray-500">{category.count} items</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Records List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Medical Records</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {records.map((record, index) => {
            const Icon = record.icon;
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{record.type}</h3>
                      <p className="text-sm text-gray-500">Medical Record</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{record.date}</span>
                    <div className="flex space-x-2">
                      {record.prescription && (
                        <button
                          onClick={() => handleDownload(record.prescription, "prescription")}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center space-x-1"
                        >
                          <Download className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-600">Prescription</span>
                        </button>
                      )}
                      {record.testReport && (
                        <button
                          onClick={() => handleDownload(record.testReport, "test")}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center space-x-1"
                        >
                          <Download className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-600">Test Report</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {record.category}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Health Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-white rounded-xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Health Timeline</h2>
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            {records.map((record, index) => (
              <div key={record.id} className="relative pl-10">
                <div className="absolute left-0 top-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{record.type}</h3>
                  <p className="text-sm text-gray-500">{record.date}</p>
                  <div className="flex space-x-4 mt-2">
                    {record.prescription && (
                      <button
                        onClick={() => handleDownload(record.prescription, "prescription")}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Prescription
                      </button>
                    )}
                    {record.testReport && (
                      <button
                        onClick={() => handleDownload(record.testReport, "test")}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Test Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HealthRecords;
