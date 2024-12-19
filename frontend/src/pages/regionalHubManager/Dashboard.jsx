import React, { useEffect, useState } from 'react';
import { 
  FaBox, 
  FaTruckLoading, 
  FaCheckCircle, 
  FaHandHolding, 
  FaClock, 
  FaStar 
} from 'react-icons/fa';

const RegionalHubDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    localOfficeCount: 0,
    totalDeliveredParcels: 0,
    totalPickupParcels: 0,
    averageDeliveryTime: 0,
    averageCustomerRating: 0,
    totalParcels: 0,
    parcelsInProgress: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/regional-hub-manager/dashboard');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const {
    totalParcels,
    parcelsInProgress,
    totalDeliveredParcels,
    totalPickupParcels,
    averageDeliveryTime,
    averageCustomerRating,
  } = dashboardData;

  return (
    <div className="bg-blue-900 min-h-screen p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Regional Hub Manager Dashboard</h1>
      
      {/* Parcel Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        
        {/* Total Parcels */}
        <div className="bg-white text-blue-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <FaBox className="text-4xl" />
            <div className="text-right">
              <h2 className="text-2xl font-bold">{totalParcels}</h2>
              <p className="text-gray-600">Total Parcels Processed</p>
            </div>
          </div>
        </div>
        
        {/* Parcels in Progress */}
        <div className="bg-white text-blue-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <FaTruckLoading className="text-4xl" />
            <div className="text-right">
              <h2 className="text-2xl font-bold">{parcelsInProgress}</h2>
              <p className="text-gray-600">Parcels In Progress</p>
            </div>
          </div>
        </div>
        
        {/* Delivered Parcels */}
        <div className="bg-white text-green-500 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <FaCheckCircle className="text-4xl" />
            <div className="text-right">
              <h2 className="text-2xl font-bold">{totalDeliveredParcels}</h2>
              <p className="text-gray-600">Delivered Parcels</p>
            </div>
          </div>
        </div>
        
        {/* Picked-Up by Users */}
        <div className="bg-white text-green-500 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <FaHandHolding className="text-4xl" />
            <div className="text-right">
              <h2 className="text-2xl font-bold">{totalPickupParcels}</h2>
              <p className="text-gray-600">Picked-Up by Users</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Performance Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Average Delivery Time */}
        <div className="bg-white text-green-500 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <FaClock className="text-4xl" />
            <div className="text-right">
              <h2 className="text-2xl font-bold">{averageDeliveryTime.toFixed(2)} days</h2>
              <p className="text-gray-600">Average Delivery Time</p>
            </div>
          </div>
        </div>
        
        {/* Average Customer Rating */}
        <div className="bg-white text-green-500 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <FaStar className="text-4xl" />
            <div className="text-right">
              <h2 className="text-2xl font-bold">{averageCustomerRating.toFixed(2)}</h2>
              <p className="text-gray-600">Average Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalHubDashboard;
