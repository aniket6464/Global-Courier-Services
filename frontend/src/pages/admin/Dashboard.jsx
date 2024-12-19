import React, { useEffect, useState } from 'react';
import { 
  FaBuilding, FaHubspot, FaHome, FaUserTie, FaUserCog, FaUsers, 
  FaBox, FaTruckLoading, FaCheckCircle, FaClock, FaTruck, FaStar, FaExclamationTriangle 
} from 'react-icons/fa';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/user/admin/dashboard');
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Key Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card icon={<FaBuilding className="text-blue-500 text-3xl" />} metric={dashboardData.mainBranchCount || 0} title="Main Branches" subtext="Branches across regions" />
        <Card icon={<FaHubspot className="text-green-500 text-3xl" />} metric={dashboardData.regionalHubCount || 0} title="Regional Hubs" subtext="Regional hubs operating" />
        <Card icon={<FaHome className="text-yellow-500 text-3xl" />} metric={dashboardData.localOfficeCount || 0} title="Local Offices" subtext="Local offices in service" />
      </div>

      {/* Management & Personnel Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card icon={<FaUserTie className="text-blue-500 text-3xl" />} metric={dashboardData.mainBranchManagerCount || 0} title="Main Branch Managers" />
        <Card icon={<FaUserTie className="text-green-500 text-3xl" />} metric={dashboardData.regionalHubManagerCount || 0} title="Regional Hub Managers" />
        <Card icon={<FaUserTie className="text-yellow-500 text-3xl" />} metric={dashboardData.localOfficeManagerCount || 0} title="Local Office Managers" />
        <Card icon={<FaUserCog className="text-green-500 text-3xl" />} metric={dashboardData.operationsHeadCount || 0} title="Operations Heads" />
        <Card icon={<FaTruckLoading className="text-yellow-500 text-3xl" />} metric={dashboardData.deliveryPersonnelCount || 0} title="Delivery Personnel" />
        <Card icon={<FaUsers className="text-blue-500 text-3xl" />} metric={dashboardData.customerCount || 0} title="Customers" />
      </div>

      {/* Parcel Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card icon={<FaBox className="text-blue-500 text-3xl" />} metric={dashboardData.parcelCount || 0} title="Total Parcels" />
        <Card icon={<FaTruckLoading className="text-yellow-500 text-3xl" />} metric={dashboardData.parcelsInProgress || 0} title="Parcels in Progress" />
        <Card icon={<FaCheckCircle className="text-green-500 text-3xl" />} metric={dashboardData.totalDeliveredParcels || 0} title="Delivered Parcels" />
        <Card icon={<FaTruck className="text-red-500 text-3xl" />} metric={dashboardData.totalPickupParcels || 0} title="Pick-Up by Users" />
      </div>

      {/* Performance Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <PerformanceCard
          icon={<FaClock className="text-blue-500 text-3xl" />}
          metric={`${(dashboardData.averageProcessingTime || 0).toFixed(2)} hrs`}
          title="Average Processing Time"
        />
        <PerformanceCard
          icon={<FaTruck className="text-green-500 text-3xl" />}
          metric={`${(dashboardData.averageDeliveryTime || 0).toFixed(2)} hrs`}
          title="Average Delivery Time"
        />
        <PerformanceCard
          icon={<FaStar className="text-yellow-500 text-3xl" />}
          metric={(dashboardData.averageCustomerRating || 0).toFixed(2)}
          title="Average Customer Rating"
        />
        <PerformanceCard
          icon={<FaExclamationTriangle className="text-red-500 text-3xl" />}
          metric={`${((dashboardData.customerComplaintRate || 0) * 100).toFixed(2)}%`}
          title="Customer Complaint Rate"
        />
      </div>

    </div>
  );
};

// Card Component
const Card = ({ icon, metric, title, subtext }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center mb-4">
      {icon}
      <div className="ml-4">
        <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-900">{metric}</p>
    {subtext && <p className="text-gray-500 mt-1">{subtext}</p>}
  </div>
);

// Performance Card Component
const PerformanceCard = ({ icon, metric, title }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center mb-4">
      {icon}
      <div className="ml-4">
        <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900">{metric}</p>
  </div>
);

export default Dashboard;
