import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaMapMarkerAlt, FaHistory, FaExclamationTriangle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({ activeParcels: 0, requestCount: 0 });
  const { currentUser } = useSelector((state) => state.user);
  const today = new Date().toLocaleDateString();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/user/customer/dashboard');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Customer Dashboard</h1>
        <p className="text-lg text-gray-600 mt-2">Welcome, {currentUser.name}!</p>
        <p className="text-md text-gray-500">Active Customer • {today}</p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Number of Active Parcels */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="text-5xl font-bold text-blue-700">{dashboardData.activeParcels}</div>
          <div className="text-xl font-medium mt-2">Active Parcels</div>
        </div>

        {/* Number of Requests */}
        <div className="bg-orange-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="text-5xl font-bold text-orange-700">{dashboardData.requestCount}</div>
          <div className="text-xl font-medium mt-2">Requests</div>
        </div>
      </div>

      {/* Quick Access Buttons Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* New Parcel Request */}
        <Link
          to="/customer/parcel-management/new-request"
          className="bg-green-500 text-white p-4 rounded-lg flex items-center justify-center space-x-3 hover:bg-green-600 transition-colors"
        >
          <FaPlus className="text-2xl" />
          <span className="text-xl font-bold">New Parcel Request</span>
        </Link>

        {/* Track Parcels */}
        <Link
          to="/customer/parcel-management/track-parcel"
          className="bg-blue-500 text-white p-4 rounded-lg flex items-center justify-center space-x-3 hover:bg-blue-600 transition-colors"
        >
          <FaMapMarkerAlt className="text-2xl" />
          <span className="text-xl font-bold">Track Parcels</span>
        </Link>

        {/* View Parcel History */}
        <Link
          to="/customer/parcel-management/parcel-history"
          className="bg-gray-400 text-white p-4 rounded-lg flex items-center justify-center space-x-3 hover:bg-gray-500 transition-colors"
        >
          <FaHistory className="text-2xl" />
          <span className="text-xl font-bold">View Parcel History</span>
        </Link>

        {/* File a Complaint */}
        <Link
          to="/customer/complaints"
          className="bg-red-500 text-white p-4 rounded-lg flex items-center justify-center space-x-3 hover:bg-red-600 transition-colors"
        >
          <FaExclamationTriangle className="text-2xl" />
          <span className="text-xl font-bold">File a Complaint</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
