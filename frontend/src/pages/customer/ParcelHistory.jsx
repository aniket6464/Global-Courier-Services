import { useState, useEffect } from 'react';
import { FiEye } from 'react-icons/fi';

const ParcelHistory = () => {
  const [parcels, setParcels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [limit, setLimit] = useState(10); // Default limit per page
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [parcelDetails, setParcelDetails] = useState(null);

  useEffect(() => {
    // Fetch parcels from the backend with search, filter, limit, and page options
    fetchParcels();
  }, [searchQuery, filterStatus]);

  const fetchParcels = async () => {
    // Backend API call (adjust the API endpoint accordingly)
    const response = await fetch(
      `/api/user/customer/parcel-history?search=${searchQuery}&status=${filterStatus}`
    );
    const data = await response.json();
    setParcels(data);
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleFilterStatus = (e) => setFilterStatus(e.target.value);
  // const handleLimitChange = (e) => setLimit(e.target.value);
  // const handlePageChange = (newPage) => setCurrentPage(newPage);

  // Fetch parcel details
  const handleViewDetails = async (parcelId) => {
    try {
      const response = await fetch(`/api/parcel/read/${parcelId}`);
      const data = await response.json();
      if (response.ok) {
        setParcelDetails(data);
        setIsDetailsOpen(true); // Open the modal
      } else {
        alert(`Error fetching parcel details: ${data.message}`);
      }
    } catch (error) {
      console.error("API error while fetching parcel details:", error);
      alert("Failed to fetch parcel details. Please try again.");
    }
  };

  // Close parcel details modal
  const handleDetailsClose = () => {
    setParcelDetails(null);
    setIsDetailsOpen(false);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-4">Parcel History</h1>

      {/* Search, Filter, and Limit */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4 space-y-3 lg:space-y-0 lg:space-x-4">
        <input
          type="text"
          className="w-full lg:w-1/3 p-2 border rounded-md"
          placeholder="Search by tracking number, sender, recipient..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <select
          className="w-full lg:w-1/6 p-2 border rounded-md"
          value={filterStatus}
          onChange={handleFilterStatus}
        >
          <option value="">All Status</option>
          <option value="Pickup">Pickup</option>
          <option value="Delivered">Delivered</option>
        </select>
        {/* <select
          className="w-full lg:w-1/6 p-2 border rounded-md"
          value={limit}
          onChange={handleLimitChange}
        >
          <option value="10">Limit 10</option>
          <option value="20">Limit 20</option>
          <option value="50">Limit 50</option>
        </select> */}
      </div>

      {/* Parcel Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4 border">Tracking No</th>
              <th className="p-4 border">Sender Name</th>
              <th className="p-4 border">Recipient Name</th>
              <th className="p-4 border">Status</th>
              <th className="p-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel.tracking_number} className="hover:bg-gray-50">
                <td className="p-4 border">{parcel.tracking_number}</td>
                <td className="p-4 border">{parcel.sender_name}</td>
                <td className="p-4 border">{parcel.recipient_name}</td>
                <td className="p-4 border">{parcel.status}</td>
                <td className="p-4 border">
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleViewDetails(parcel._id)}
                  >
                    <FiEye className="w-5 h-5" title="View Details" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-white rounded disabled:bg-gray-200"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-white rounded"
        >
          Next
        </button>
      </div> */}

      {/* Parcel Details Modal */}
      {isDetailsOpen && parcelDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-lg font-bold mb-4">Parcel Details</h2>
            <div className="space-y-3">
              <p>
                <strong>Tracking Number:</strong> {parcelDetails.tracking_number}
              </p>
              <p>
                <strong>Sender:</strong> {parcelDetails.sender_name} (
                {parcelDetails.sender_contact})
              </p>
              <p>
                <strong>Sender Address:</strong> {parcelDetails.sender_address}
              </p>
              <p>
                <strong>Recipient:</strong> {parcelDetails.recipient_name} (
                {parcelDetails.recipient_contact})
              </p>
              <p>
                <strong>Recipient Address:</strong>{" "}
                {parcelDetails.recipient_address}
              </p>
              <p>
                <strong>Parcel Type :</strong>{" "}
                {parcelDetails.type}
              </p>
              <p>
                <strong>Status:</strong> {parcelDetails.status}
              </p>
              <h3 className="font-bold mt-4">Parcel Details:</h3>
              <ul className="list-disc ml-5">
                {parcelDetails.parcel_details.map((detail, index) => (
                  <li key={index}>
                    <strong>Weight:</strong> {detail.weight} kg,{" "}
                    <strong>Dimensions:</strong> {detail.length}x
                    {detail.width}x{detail.height} cm,{" "}
                    <strong>Price:</strong> ${detail.price}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDetailsClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelHistory;
