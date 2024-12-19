import React, { useState, useEffect } from 'react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch complaints from the API
  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/user/admin/read-complaint');
      const data = await response.json();

      if (response.ok && data.success) {
        setComplaints(data.complaints);
      } else {
        throw new Error(data.message || 'Failed to fetch complaints');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">Complaints</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center">Loading complaints...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Complaint ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Customer Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date Submitted</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Complaint Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Complaint</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length > 0 ? (
                complaints.map((complaint, index) => (
                  <tr key={complaint._id} className="border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1} {/* Serial Number */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {complaint.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {complaint.complaintType.charAt(0).toUpperCase() + complaint.complaintType.slice(1).toLowerCase()} {/* Capitalized Complaint Type */}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{complaint.complaintDescription}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Complaints;
