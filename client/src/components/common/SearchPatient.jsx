import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion'; // Import motion from Framer Motion for animations
import { apiStart } from '../../const';

const SearchPatient = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // Track if search has been performed
  const [prescriptionUpdates, setPrescriptionUpdates] = useState({});

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiStart}/api/v1/doctor/searchPatient`, {
        search: searchTerm
      });
      setResults(response.data.data);
      setSearched(true); // Update searched state
      toast.success('User found successfully');
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrescription = async (patientId, prescription) => {
    try {
      const response = await axios.put(`${apiStart}/api/v1/doctor/editPrescription/${patientId}`, {
        prescription
      });
      console.log('Prescription saved:', response.data);
      toast.success('Prescription saved successfully');
      // Update local state to reflect saved prescription
      setResults(prevResults =>
        prevResults.map(result =>
          result._id === patientId ? { ...result, prescription } : result
        )
      );
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error('Error saving prescription');
    }
  };

  const handleSearchButtonClick = async () => {
    if (searchTerm.trim() === '') {
      toast.error('Please enter a search term');
      return;
    }

    handleSearch();
  };

  const handleSavePrescriptionButtonClick = async (patientId) => {
    const prescription = prescriptionUpdates[patientId];
    if (!prescription) {
      toast.error('Please enter a prescription');
      return;
    }

    try {
      await handleSavePrescription(patientId, prescription);
      // Clear the prescription updates after saving
      setPrescriptionUpdates(prevUpdates => ({
        ...prevUpdates,
        [patientId]: ''
      }));
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error('Error saving prescription');
    }
  };

  const renderFormData = (formData) => {
    return Object.keys(formData).map((key) => (
      <p key={key}>
        <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {formData[key]}
      </p>
    ));
  };

  const renderPrescriptionHistory = (prescriptionHistory) => {
    return (
      <div className="mt-4">
        <p className="font-medium">Prescription History:</p>
        {prescriptionHistory.map((prescription, index) => (
          <div key={index} className="mt-2">
            <p>{prescription.prescription}</p>
            <small className="text-gray-500">Updated on {new Date(prescription.date).toLocaleString()}</small>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-white">
      <Toaster position="top-right" />
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold mb-4"
      >
        Search User
      </motion.h1>
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 bg-richblack-800 border border-richblack-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-richblack-400"
          placeholder="Search by Name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <motion.button
        onClick={handleSearchButtonClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {loading ? 'Loading...' : 'Search'}
      </motion.button>
      <div className="mt-4">
        {results.length > 0 ? (
          results.map((result) => (
            <motion.div
              key={result._id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-4 mb-4 bg-richblack-800 border border-richblack-600 rounded-md"
            >
              <p><strong>ID:</strong> {result._id}</p>
              <p><strong>Category:</strong> {result.formCategory}</p>
              {renderFormData(result.formData)}
              <p><strong>Unique ID:</strong> {result.uniqueId}</p>
              <p><strong>Email:</strong> {result.email}</p>
              <p><strong>Created At:</strong> {new Date(result.createdAt).toLocaleString()}</p>

              {/* Display prescription history */}
              {result.prescriptionHistory && renderPrescriptionHistory(result.prescriptionHistory)}

              {/* Prescription editing */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-richblack-800 mb-1" htmlFor={`prescription-${result._id}`}>Prescription/Advice:</label>
                <textarea
                  id={`prescription-${result._id}`}
                  className="w-full px-4 py-2 border text-black border-richblack-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={prescriptionUpdates[result._id] || ''}
                  onChange={(e) => {
                    const updatedPrescription = e.target.value;
                    setPrescriptionUpdates({
                      ...prescriptionUpdates,
                      [result._id]: updatedPrescription
                    });
                  }}
                />
                <motion.button
                  onClick={() => handleSavePrescriptionButtonClick(result._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                >
                  Save Prescription
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          !loading && searched && <p className="mt-4">No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPatient;
