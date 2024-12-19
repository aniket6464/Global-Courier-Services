import React, { useEffect, useState } from 'react';
import { FaBox, FaTruckLoading, FaCheckCircle, FaHandHolding, FaClock, FaStar } from 'react-icons/fa';

const LocalOfficeDashboard = () => {
  const [data, setData] = useState({
    totalDeliveredParcels: 0,
    totalPickupParcels: 0,
    averageDeliveryTime: 0,
    averageCustomerRating: 0,
    totalParcels: 0,
    parcelsInProgress: 0,
  });

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/user/local-office-manager/dashboard');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="bg-blue-900 min-h-screen p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Local Office Manager Dashboard</h1>

      {/* Parcel Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        {/* Total Parcels */}
        <div className="bg-white text-blue-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <FaBox className="text-4xl" />
            <div className="text-right">
              <h2 className="text-2xl font-bold">{data.totalParcels}</h2>
              <p className="text-gray-600">Total Parcels Processed</p>
            </div>
          </div>
        </div>

        {/* Parcels in Progress */}
        <div className="bg-white text-blue-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <FaTruckLoading className="text-4xl" />
            <div className="text-right">
              <h2 className="text-2xl font-bold">{data.parcelsInProgress}</h2>
              <p className="text-gray-600">Parcels In Progress</p>
            </div>
          </div>
        </div>

        {/* Delivered Parcels */}
        <div className="bg-white text-green-500 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <FaCheckCircle className="text-4xl" />
            <div className="text-right">
              <h2 className="text-2xl font-bold">{data.totalDeliveredParcels}</h2>
              <p className="text-gray-600">Delivered Parcels</p>
            </div>
          </div>
        </div>

        {/* Picked-Up by Users */}
        <div className="bg-white text-green-500 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <FaHandHolding className="text-4xl" />
            <div className="text-right">
              <h2 className="text-2xl font-bold">{data.totalPickupParcels}</h2>
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
              <h2 className="text-2xl font-bold">{data.averageDeliveryTime.toFixed(2)} hours</h2>
              <p className="text-gray-600">Average Delivery Time</p>
            </div>
          </div>
        </div>

        {/* Average Customer Rating */}
        <div className="bg-white text-green-500 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <FaStar className="text-4xl" />
            <div className="text-right">
              <h2 className="text-2xl font-bold">{data.averageCustomerRating.toFixed(2)}</h2>
              <p className="text-gray-600">Average Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalOfficeDashboard;
