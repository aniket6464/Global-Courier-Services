import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const TrackParcel = () => {
  const { trackingNumber: initialTrackingNumber } = useParams(); // Get tracking number from URL params
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || ""); // Use initial tracking number if available
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTrackingData = async () => {
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError("");
    setTrackingData([]);
    try {
      const response = await fetch(`/api/parcel/track/${trackingNumber}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tracking data. Please check the tracking number.");
      }
      const data = await response.json();
      setTrackingData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data if tracking number is provided as a URL parameter
    if (initialTrackingNumber) {
      fetchTrackingData();
    }
  }, [initialTrackingNumber]); // Run only when initialTrackingNumber changes

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      fetchTrackingData();
    } else {
      setError("Please enter a valid tracking number.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Track Your Parcel
        </h1>
        <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            placeholder="Enter Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Track
          </button>
        </form>
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && trackingData.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Parcel Journey</h2>
            <div className="space-y-4">
              {trackingData.map((entry, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-4 bg-gray-50"
                >
                  <p className="text-gray-700 font-medium">
                    Status: <span className="text-blue-600">{entry.status}</span>
                  </p>
                  <p className="text-gray-600">
                    Date: {new Date(entry.date).toLocaleString()}
                  </p>
                  {entry.branch ? (
                    <div className="mt-2 text-gray-600">
                      <p>Branch Code: {entry.branch.branch_code}</p>
                      <p>City: {entry.branch.city}</p>
                      <p>State: {entry.branch.state}</p>
                      <p>Country: {entry.branch.country}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-500">No branch information available.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackParcel;
