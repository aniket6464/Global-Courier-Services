import { useState, useEffect } from "react";
import { FiMapPin, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CustomerParcelList = () => {
  const [parcels, setParcels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [limit, setLimit] = useState(10); // Default limit per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Initialize total pages
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate()

  const statusMap = {
    "Created": "Created",
    "Picked Up": "Picked%20Up",
    "At Local Office": "At%20Local%20Office",
    "At Regional Hub": "At%20Regional%20Hub",
    "At Main Branch": "At%20Main%20Branch",
    "Ready to Pickup (at the branch)": "Ready%20to%20Pickup%20(at%20the%20branch)",
    "Pickup": "Pickup",
    "Delivered": "Delivered",
  };

  useEffect(() => {
    fetchCustomerParcels();
  }, [searchQuery, filterStatus, limit, currentPage]);

  const fetchCustomerParcels = async () => {
    const apiUrl = `/api/user/customer/read-parcel?search=${encodeURIComponent(
      searchQuery
    )}&status=${filterStatus}&limit=${limit}&page=${currentPage}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        setParcels(data.parcels);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } else {
        console.error("Error fetching parcels:", data.message);
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleFilterStatus = (e) => setFilterStatus(e.target.value);
  const handleLimitChange = (e) => setLimit(e.target.value);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFeedbackOpen = (parcel) => {
    setSelectedParcel(parcel);
    setIsFeedbackOpen(true);
  };

  const handleFeedbackClose = () => {
    setIsFeedbackOpen(false);
    setRating(0); // Reset rating when modal is closed
  };

  const submitRating = async () => {
    if (!selectedParcel || rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
  
    try {
      const response = await fetch(`/api/user/customer/rating/${selectedParcel._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
  
      if (response.ok) {
        alert("Rating submitted successfully!");
        setIsFeedbackOpen(false);
        setRating(0);
        fetchCustomerParcels();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert(`An unexpected error occurred: ${error.message}`);
    }
  };
  

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Your Active Parcels</h1>

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
          {Object.keys(statusMap).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          className="w-full lg:w-1/6 p-2 border rounded-md"
          value={limit}
          onChange={handleLimitChange}
        >
          <option value="10">Limit 10</option>
          <option value="20">Limit 20</option>
          <option value="50">Limit 50</option>
        </select>
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
              <th className="p-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id} className="hover:bg-gray-50">
                <td className="p-4 border">{parcel.tracking_number}</td>
                <td className="p-4 border">{parcel.sender_name}</td>
                <td className="p-4 border">{parcel.recipient_name}</td>
                <td className="p-4 border">{parcel.status}</td>
                <td className="p-4 border flex space-x-2">
                  <button 
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => navigate(`/customer/parcel-management/track-parcel/${parcel.tracking_number}`)}
                  >
                    <FiMapPin className="w-5 h-5" title="Track Journey" />
                  </button>
                  <button
                    onClick={() => handleFeedbackOpen(parcel)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <FiStar className="w-5 h-5" title="Give Rating" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
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
        <span>
          Page {currentPage} of {totalPages}
        </span>
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

      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Rate Your Parcel</h2>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-2xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              onClick={submitRating}
            >
              Submit Rating
            </button>
            <button
              className="mt-2 bg-gray-500 text-white px-4 py-2 rounded w-full"
              onClick={handleFeedbackClose}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerParcelList;
