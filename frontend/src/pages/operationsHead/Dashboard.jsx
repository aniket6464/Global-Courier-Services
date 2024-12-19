import React, { useEffect, useState } from 'react';
import { 
  FaClock, 
  FaTruck, 
  FaCheckCircle, 
  FaStar, 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaArrowUp, 
  FaArrowDown 
} from 'react-icons/fa';

// Reusable Metric Card Component
const MetricCard = ({ icon, metric, title, subtext, trend }) => {
  const TrendIcon = trend?.type === 'up' ? FaArrowUp : FaArrowDown;
  const trendColor = trend?.type === 'up' ? 'text-green-500' : 'text-red-500';

  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
      aria-label={title}
    >
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          {React.cloneElement(icon, { className: "text-3xl" })}
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold text-gray-900">{metric}</p>
        {trend && (
          <div className={`flex items-center ${trendColor}`}>
            <TrendIcon className="mr-1" />
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      {subtext && <p className="text-gray-500 mt-2">{subtext}</p>}
    </div>
  );
};

const OperationsDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    averageProcessingTime: 0,
    averageDeliveryTime: 0,
    accuracyOfDelivery: 0,
    averageCustomerRating: 0,
    complaintRate: 0,
    undamagedDeliveryRate: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/user/operations-head/dashboard');
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
    <div className="min-h-screen bg-blue-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Operations Head Dashboard</h1>

      {/* Key Operational Metrics Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Key Operational Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Average Processing Time */}
          <MetricCard 
            icon={<FaClock className="text-blue-500" />} 
            metric={`${dashboardData.averageProcessingTime} hrs`} 
            title="Average Processing Time" 
            subtext="Time taken from parcel initiation to dispatch."
          />
          
          {/* Average Delivery Speed */}
          <MetricCard 
            icon={<FaTruck className="text-yellow-500" />} 
            metric={`${dashboardData.averageDeliveryTime} days`} 
            title="Average Delivery Speed" 
            subtext="Average time from dispatch to delivery."
          />
          
          {/* Accuracy of Delivery */}
          <MetricCard 
            icon={<FaCheckCircle className="text-green-500" />} 
            metric={`${dashboardData.accuracyOfDelivery}%`} 
            title="Accuracy of Delivery" 
            subtext="Percentage of parcels delivered correctly."
          />
        </div>
      </section>

      {/* Customer Satisfaction & Parcel Condition Metrics Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Customer Satisfaction & Parcel Condition</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Average Customer Rating */}
          <MetricCard 
            icon={<FaStar className="text-yellow-500" />} 
            metric={`${dashboardData.averageCustomerRating}`} 
            title="Average Customer Rating" 
            subtext="Average rating from customers."
          />
          
          {/* Complaint Rate */}
          <MetricCard 
            icon={<FaExclamationTriangle className="text-red-500" />} 
            metric={`${dashboardData.complaintRate}%`} 
            title="Complaint Rate" 
            subtext="Percentage of complaints lodged by customers."
          />
          
          {/* Undamaged Delivery Rate */}
          <MetricCard 
            icon={<FaShieldAlt className="text-green-500" />} 
            metric={`${dashboardData.undamagedDeliveryRate}%`} 
            title="Undamaged Delivery Rate" 
            subtext="Percentage of parcels delivered without damage."
          />
        </div>
      </section>
    </div>
  );
};

export default OperationsDashboard;
