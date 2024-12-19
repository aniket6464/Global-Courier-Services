import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState({
    totalAssignedDeliveries: 0,
    totalCompletedDeliveries: 0,
    numberOfComplaints: 0,
  });
  const personnelName = "John Doe"; // Replace with dynamic name if needed
  const today = new Date().toLocaleDateString();

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/user/delivery-personnel/dashboard');
        const result = await response.json();
        setData(result);
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
        <h1 className="text-4xl font-bold">Delivery Personnel Dashboard</h1>
        <p className="text-lg text-gray-600 mt-2">Good Morning, {personnelName}!</p>
        <p className="text-md text-gray-500">{today}</p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Assigned Deliveries */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="text-5xl font-bold text-blue-700">
            {data.totalAssignedDeliveries}
          </div>
          <div className="text-xl font-medium mt-2">Total Assigned Deliveries</div>
          <Link
            to="/delivery-personnel/assigned-deliveries"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors inline-block"
          >
            View Assigned Deliveries
          </Link>
        </div>

        {/* Total Completed Deliveries */}
        <div className="bg-green-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="text-5xl font-bold text-green-700">
            {data.totalCompletedDeliveries}
          </div>
          <div className="text-xl font-medium mt-2">Total Completed Deliveries</div>
          <Link
            to="/delivery-personnel/completed-deliveries"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors inline-block"
          >
            View Completed Deliveries
          </Link>
        </div>

        {/* Number of Complaints */}
        <div className="bg-red-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="text-5xl font-bold text-red-700">{data.numberOfComplaints}</div>
          <div className="text-xl font-medium mt-2">Number of Complaints</div>
          <Link
            to="/delivery-personnel/complaints"
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors inline-block"
          >
            View Complaints
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
