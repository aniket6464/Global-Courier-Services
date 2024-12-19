import React, { useState, useEffect } from 'react';

const LocalOfficePerformance = () => {
  const [officeData, setOfficeData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'branch_code', order: 'ascending' });
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLocalOfficeData();
  }, [sortConfig, limit, currentPage]);

  const fetchLocalOfficeData = async () => {
    try {
      const sortQuery = `${sortConfig.key},${sortConfig.order}`;
      const response = await fetch(`/api/branch/local-office/performance?sort=${sortQuery}&limit=${limit}&page=${currentPage}`);

      if (!response.ok) {
        throw new Error('Failed to fetch local office data');
      }

      const data = await response.json();

      const offices = data.offices.map((office) => ({
        branch_code: office.branch_code,
        parcel_delivery_efficiency: {
          delivery_speed: office.performance_tracking.average_delivery_time,
          On_Time_Delivery_Rate:
            ((office.performance_tracking.total_on_time_delivered_parcels / office.performance_tracking.total_delivered_parcels) || 0) * 100,
        },
        customer_satisfaction: {
          average_rating: office.performance_tracking.average_customer_rating,
          complaint_rate:
            ((office.performance_tracking.total_complaints / office.performance_tracking.total_delivered_parcels) || 0) * 100,
        },
      }));

      setOfficeData(offices);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSortKeyChange = (event) => {
    const key = event.target.value;
    setSortConfig({ ...sortConfig, key });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page when the limit changes
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Local Office Performance</h2>

      {/* Sorting Controls */}
      <div className="mb-4 flex space-x-4">
        <div className="mr-4">
          <label htmlFor="sortKey" className="mr-2">Sort by:</label>
          <select
            id="sortKey"
            value={sortConfig.key}
            onChange={handleSortKeyChange}
            className="border p-2"
          >
            <option value="branch_code">Branch Code</option>
            <option value="average_delivery_time">Parcel Delivery Efficiency</option>
            <option value="average_customer_rating">Customer Satisfaction</option>
          </select>
        </div>

        {/* Limit Selection */}
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
              <th className="py-2 px-4">Parcel Delivery Efficiency (Speed, Accuracy)</th>
              <th className="py-2 px-4">Customer Satisfaction (Rating, Complaint Rate)</th>
            </tr>
          </thead>
          <tbody>
            {officeData.map((office, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{office.branch_code}</td>
                <td className="py-2 px-4">
                  Speed: {office.parcel_delivery_efficiency.delivery_speed.toFixed(2) || 0} hours<br />
                  On-Time Delivery Rate: {office.parcel_delivery_efficiency.On_Time_Delivery_Rate.toFixed(2)}%
                </td>
                <td className="py-2 px-4">
                  Rating: {office.customer_satisfaction.average_rating.toFixed(2)}/5<br />
                  Complaints: {office.customer_satisfaction.complaint_rate.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination and Limit Controls */}
      <div className="mt-4 flex justify-center items-center space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
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
          onClick={() => handlePageChange(currentPage + 1)}
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

export default LocalOfficePerformance;
