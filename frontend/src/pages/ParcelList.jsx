import { useState, useEffect } from "react";
import {
  FiEdit,
  FiTrash,
  FiEye,
  FiCheck,
  FiUser,
  FiMapPin,
  FiMessageSquare,
} from "react-icons/fi";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ParcelList = ({ isAdmin }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [parcels, setParcels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("tracking_number");
  const [filterStatus, setFilterStatus] = useState("");
  const [limit, setLimit] = useState(10); // Default limit per page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Initialize total pages
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [rating, setRating] = useState(0);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [availablePersonnels, setAvailablePersonnels] = useState([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState("");
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState("");
  const [deliveryPoints, setDeliveryPoints] = useState([]);
  const [updateOptions, setUpdateOptions] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [parcelDetails, setParcelDetails] = useState(null);
  const navigate = useNavigate();

  const nextStatusMap = {
    'At Main Branch': ['Held at Main Branch'],
    'At Destination Main Branch': ['Held at Main Branch'],
    'At Regional Hub': ['Held at Regional Hub'],
    'At Destination Regional Hub': ['Held at Regional Hub'],
    'At Local Office': ['Ready to Pickup (at the branch)'],
    'At Destination Local Office': ['Ready to Pickup (at the branch)'],
    'Ready to Pickup (at the branch)': ['Pickup'],
  };

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
    fetchParcels();
  }, [searchQuery, sortOption, filterStatus, limit, currentPage]);

  const fetchParcels = async () => {
    const encodedStatus = filterStatus ? statusMap[filterStatus] || "" : "";
    const apiUrl = `/api/parcel/read?search=${encodeURIComponent(
      searchQuery
    )}&sort=${sortOption}&status=${encodedStatus}&limit=${limit}&page=${currentPage}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data)

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
  const handleSort = (e) => setSortOption(e.target.value);
  const handleFilterStatus = (e) => setFilterStatus(e.target.value);
  const handleLimitChange = (e) => setLimit(e.target.value);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteParcel = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this parcel?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/parcel/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Parcel deleted successfully!");
        fetchParcels(); // Refresh the parcel list after deletion
      } else {
        const data = await response.json();
        alert(`Error deleting parcel: ${data.message}`);
      }
    } catch (error) {
      alert(`API error while deleting parcel: ${error.message}`);
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

  const submitFeedback = () => {
    console.log(
      `Submitted rating of ${rating} for parcel ${selectedParcel.tracking_number}`
    );
    handleFeedbackClose(); // Close the modal after submitting
  };

  // Open modal to assign personnel
const handleAssignDeliveryOpen = (parcel) => {
  setSelectedParcel(parcel);
  fetchPersonnels(); // Fetch available personnels
  updateDeliveryPoints(); // Set delivery points based on role
  setIsAssignModalOpen(true);
};

// Close modal
const handleAssignDeliveryClose = () => {
  setIsAssignModalOpen(false);
  setSelectedPersonnel("");
  setSelectedDeliveryPoint("");
};

// Fetch personnels from API
const fetchPersonnels = async () => {
  try {
    const response = await fetch(`/api/user/delivery-personnel/read`);
    const data = await response.json();
    if (response.ok) {
      setAvailablePersonnels(data.personnels);
    } else {
      console.error("Error fetching delivery personnel:", data.message);
    }
  } catch (error) {
    console.error("API error while fetching personnel:", error);
  }
};

// Set delivery points based on role
const updateDeliveryPoints = () => {
  const pointsByRole = {
    "local office manager": ["Regional Hub", "Deliver to Customer","Pickup parcel"],
    "regional hub manager": ["Main Branch", "Destination Local Office", "Deliver to Customer"],
    "main branch manager": ["Destination Main Branch", "Destination Regional Hub", "Deliver to Customer"],
  };
  setDeliveryPoints(pointsByRole[currentUser.role] || []);
};

const handleAssignDelivery = async () => {
  if (!selectedPersonnel || !selectedDeliveryPoint) {
    alert("Please select both personnel and delivery point.");
    return;
  }

  try {
    const response = await fetch(`/api/user/delivery-personnel/assign-delivery/${selectedPersonnel}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parcel_id: selectedParcel._id,
        deliveryType: selectedDeliveryPoint,
      }),
    });

    if (response.ok) {
      alert("Delivery assigned successfully!");
      fetchParcels(); // Refresh parcel list
      handleAssignDeliveryClose(); // Close modal
    } else {
      const data = await response.json();
      alert(`Error assigning delivery: ${data.message}`);
    }
  } catch (error) {
    alert(`API error while assigning delivery: ${error.message}`);
  }
};

const handleStatusUpdate = async (parcelId, currentStatus) => {
  try {
    const nextStatuses = nextStatusMap[currentStatus] || [];
    setUpdateOptions(nextStatuses);
    setSelectedDelivery({ id: parcelId, currentStatus });
  } catch (error) {
    console.error('Error handling status update:', error);
  }
};

const updateStatus = async () => {
  try {
    if (!selectedDelivery) return;

    const body = {
      status: updateOptions[0], // Assume the first option is chosen by default
    };

    const response = await fetch(`/api/parcel/update-status/${selectedDelivery.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.ok){
      alert('Status updated successfully!');
      setSelectedDelivery(null);
      fetchParcels();
    }else{
      alert(`Error updating status: ${message}`);
      console.log(`response`)
    }
  } catch (error) {
    alert('Error updating status:', error);
    console.error('Error updating status:', error);
  }
};

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

// Close update status modal
const handleUpdateStatusClose = () => {
  setUpdateOptions([]);
  setSelectedDelivery(null);
};

const handleUpdateParcel = (parcel) => {
  if (["Delivered", "Pickup"].includes(parcel.status)) {
    alert("This parcel cannot be updated as its status is Delivered or Pickup.");
    return;
  }

  // Navigate based on user role
  switch (currentUser.role) {
    case "local office manager":
      navigate(`/local-office-manager/parcel-management/update/${parcel._id}`);
      break;
    case "regional hub manager":
      navigate(`/regional-hub-manager/parcel-management/update/${parcel._id}`);
      break;
    case "main branch manager":
      navigate(`/main-branch-manager/parcel-management/update/${parcel._id}`);
      break;
    default:
      alert("You do not have permission to update this parcel.");
  }
};

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-4">All Parcels Overview</h1>

      {/* Search, Sort, Filter, and Limit */}
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
          value={sortOption}
          onChange={handleSort}
        >
          <option value="tracking_number">Sort by Tracking No</option>
          <option value="sender_name">Sort by Sender</option>
          <option value="recipient_name">Sort by Recipient</option>
          <option value="status">Sort by Status</option>
        </select>
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
                    {isAdmin && (
                      <>
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={() => handleViewDetails(parcel._id)}
                        >
                          <FiEye className="w-5 h-5" title="View Details" />
                        </button>
                        <button 
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => navigate(`/admin/parcel-management/track/${parcel.tracking_number}`)}
                        >
                          <FiMapPin className="w-5 h-5" title="Track Journey" />
                        </button>
                      </>
                    )}
                  {!isAdmin && (
                    <>
                      <button
                        className="text-green-500 hover:text-green-700"
                        onClick={() => handleViewDetails(parcel._id)}
                      >
                        <FiEye className="w-5 h-5" title="View Details" />
                      </button>
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleUpdateParcel(parcel)}
                      >
                        <FiEdit className="w-5 h-5" title="Update" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteParcel(parcel._id)}
                      >
                        <FiTrash className="w-5 h-5" title="Delete" />
                      </button>
                      <button 
                        className="text-yellow-500 hover:text-yellow-700"
                        onClick={() => handleStatusUpdate(parcel._id, parcel.status)}
                      >
                        <FiCheck className="w-5 h-5" title="Update Status" />
                      </button>
                      {!parcel.assignedTo && (
                        <button
                          className="text-purple-500 hover:text-purple-700"
                          onClick={() => handleAssignDeliveryOpen(parcel)}
                        >
                          <FiUser className="w-5 h-5" title="Assign Delivery Personnel" />
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-lg font-bold mb-4">Assign Delivery Personnel</h2>
            <div className="mb-4">
              <label className="block font-medium mb-2">Select Personnel:</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedPersonnel}
                onChange={(e) => setSelectedPersonnel(e.target.value)}
              >
                <option value="">-- Select Personnel --</option>
                {availablePersonnels.map((personnel) => (
                  <option key={personnel._id} value={personnel._id}>
                    {personnel.name} ({personnel.branch.city}, {personnel.branch.state})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Select Delivery Point:</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedDeliveryPoint}
                onChange={(e) => setSelectedDeliveryPoint(e.target.value)}
              >
                <option value="">-- Select Delivery Point --</option>
                {deliveryPoints.map((point) => (
                  <option key={point} value={point}>
                    {point}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleAssignDeliveryClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignDelivery}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Update Status</h2>
            <p>Current Status: {selectedDelivery.currentStatus}</p>
            <select className="border border-gray-300 rounded-lg p-2 w-full mb-4">
              <option value="">Select Next Status</option>
              {updateOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button
                onClick={handleUpdateStatusClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded mr-2"
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={updateStatus}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default ParcelList;
