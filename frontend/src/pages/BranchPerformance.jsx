import React, { useState, useEffect } from 'react';

const BranchPerformance = ({ branchType }) => {
  const [branchData, setBranchData] = useState([]);
  const [sort, setSort] = useState('branch_code');
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBranchData();
  }, [sort, limit, currentPage, branchType]);

  const fetchBranchData = async () => {
    try {
      const url =
        branchType === 'main'
          ? `/api/branch/main-branch/performance?sort=${sort}&limit=${limit}&page=${currentPage}`
          : `/api/branch/regional-hub/performance?sort=${sort}&limit=${limit}&page=${currentPage}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch branch data');
      }

      const data = await response.json();
      const branches = branchType === 'main' ? data.branches : data.hubs;

      setBranchData(branches.map((branch) => ({
        branch_code: branch.branch_code,
        parcel_transfer_efficiency: {
          average_processing_time: branch.performance_tracking.average_processing_time,
        },
        parcel_delivery_efficiency: {
          delivery_speed: branch.performance_tracking.average_delivery_time,
          On_Time_Delivery_Rate:
            ((branch.performance_tracking.total_on_time_delivered_parcels / branch.performance_tracking.total_delivered_parcels) || 0) * 100,
        },
        customer_satisfaction: {
          average_rating: branch.performance_tracking.average_customer_rating,
          complaint_rate:
            ((branch.performance_tracking.total_complaints / branch.performance_tracking.total_parcels) || 0) * 100,
        },
      })));

      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page when limit changes
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => Math.max(1, Math.min(totalPages, prev + direction)));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{branchType === 'main' ? 'Main Branch Performance' : 'Regional Hub Performance'}</h2>

      {/* Sort and Limit Controls */}
      <div className="mb-4 flex space-x-4">
        <div>
          <label htmlFor="sort" className="mr-2">Sort By:</label>
          <select id="sort" onChange={handleSortChange} value={sort} className="border p-2">
            <option value="branch_code">Branch Code</option>
            <option value="average_processing_time">Parcel Transfer Efficiency</option>
            <option value="average_delivery_time">Parcel Delivery Efficiency</option>
            <option value="average_customer_rating">Customer Satisfaction</option>
          </select>
        </div>

        <div>
          <label htmlFor="limit" className="mr-2">Limit:</label>
          <select id="limit" value={limit} onChange={handleLimitChange} className="border p-2">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left table-auto">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">Branch Code</th>
              <th className="py-2 px-4">Parcel Transfer Efficiency (Avg Processing Time)</th>
              <th className="py-2 px-4">Parcel Delivery Efficiency (Speed, On-Time Delivery Rate)</th>
              <th className="py-2 px-4">Customer Satisfaction (Rating, Complaint Rate)</th>
            </tr>
          </thead>
          <tbody>
            {branchData.map((branch, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{branch.branch_code}</td>
                <td className="py-2 px-4">{branch.parcel_transfer_efficiency.average_processing_time.toFixed(2)} hrs</td>
                <td className="py-2 px-4">
                  Speed: {branch.parcel_delivery_efficiency.delivery_speed.toFixed(2)} hours<br />
                  On-Time Delivery Rate: {branch.parcel_delivery_efficiency.On_Time_Delivery_Rate.toFixed(2)}%
                </td>
                <td className="py-2 px-4">
                  Rating: {branch.customer_satisfaction.average_rating.toFixed(2)}/5<br />
                  Complaints: {branch.customer_satisfaction.complaint_rate.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center space-x-4">
        <button
          onClick={() => handlePageChange(-1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded font-medium transition-colors duration-200 
            ${currentPage === 1 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            }`}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages} </span>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded font-medium transition-colors duration-200 
            ${currentPage === totalPages 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BranchPerformance;
