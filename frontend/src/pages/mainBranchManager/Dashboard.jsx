import React, { useEffect, useState } from 'react';
import {
  FaBuilding,
  FaWarehouse,
  FaBox,
  FaSpinner,
  FaCheckCircle,
  FaHandHolding,
  FaClock,
  FaStar,
} from 'react-icons/fa';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    regionalHubCount: 0,
    localOfficeCount: 0,
    totalDeliveredParcels: 0,
    totalPickupParcels: 0,
    averageDeliveryTime: 0,
    averageCustomerRating: 0,
    totalParcels: 0,
    parcelsInProgress: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/user/main-branch-manager/dashboard');
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      {/* Branch Statistics Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Branch Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regional Hubs Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
            <FaBuilding className="text-blue-500 text-4xl mr-4" />
            <div>
              <h3 className="text-xl font-bold">{dashboardData.regionalHubCount}</h3>
              <p className="text-gray-600">Regional Hubs</p>
              <p className="text-gray-400 text-sm">Total number of regional hubs under this branch.</p>
            </div>
          </div>
          {/* Local Offices Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
            <FaWarehouse className="text-blue-500 text-4xl mr-4" />
            <div>
              <h3 className="text-xl font-bold">{dashboardData.localOfficeCount}</h3>
              <p className="text-gray-600">Local Offices</p>
              <p className="text-gray-400 text-sm">Total number of local offices under this branch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Parcel & Performance Metrics Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Parcel & Performance Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Parcels */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
            <FaBox className="text-blue-500 text-4xl mr-4" />
            <div>
              <h3 className="text-xl font-bold">{dashboardData.totalParcels}</h3>
              <p className="text-gray-600">Total Parcels</p>
              <p className="text-gray-400 text-sm">Total number of parcels processed.</p>
            </div>
          </div>

          {/* Parcels in Progress */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
            <FaSpinner className="text-red-500 text-4xl mr-4" />
            <div>
              <h3 className="text-xl font-bold">{dashboardData.parcelsInProgress}</h3>
              <p className="text-gray-600">Parcels in Progress</p>
              <p className="text-gray-400 text-sm">Number of parcels still in transit.</p>
            </div>
          </div>

          {/* Delivered Parcels */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
            <FaCheckCircle className="text-green-500 text-4xl mr-4" />
            <div>
              <h3 className="text-xl font-bold">{dashboardData.totalDeliveredParcels}</h3>
              <p className="text-gray-600">Delivered Parcels</p>
              <p className="text-gray-400 text-sm">Parcels that have been delivered to recipients.</p>
            </div>
          </div>

          {/* Picked-Up by Users */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
            <FaHandHolding className="text-blue-500 text-4xl mr-4" />
            <div>
              <h3 className="text-xl font-bold">{dashboardData.totalPickupParcels}</h3>
              <p className="text-gray-600">Picked-Up by Users</p>
              <p className="text-gray-400 text-sm">Parcels collected by customers.</p>
            </div>
          </div>

          {/* Average Delivery Time */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
            <FaClock className="text-yellow-500 text-4xl mr-4" />
            <div>
              <h3 className="text-xl font-bold">{dashboardData.averageDeliveryTime.toFixed(2)} hors</h3>
              <p className="text-gray-600">Average Delivery Time</p>
              <p className="text-gray-400 text-sm">Average time taken to deliver parcels.</p>
            </div>
          </div>

          {/* Average Customer Rating */}
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center">
            <FaStar className="text-yellow-500 text-4xl mr-4" />
            <div>
              <h3 className="text-xl font-bold">{dashboardData.averageCustomerRating.toFixed(2)}</h3>
              <p className="text-gray-600">Average Customer Rating</p>
              <p className="text-gray-400 text-sm">Customer satisfaction based on recent deliveries.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
