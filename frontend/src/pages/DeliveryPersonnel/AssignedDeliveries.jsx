import React, { useState, useEffect } from 'react';

const AssignedDeliveries = ({ completed = false }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [updateOptions, setUpdateOptions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactDetails, setContactDetails] = useState(null);

  useEffect(() => {
    fetchDeliveries();
  }, [searchTerm, limit, completed]);

  const fetchDeliveries = async () => {
    try {
      const apiUrl = completed
        ? `/api/user/delivery-personnel/completed-deliveries?search=${searchTerm}&limit=${limit}`
        : `/api/user/delivery-personnel/assigned-deliveries?search=${searchTerm}&limit=${limit}`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      setDeliveries(data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const statusMap = {
    'Awaiting Pickup': ['Picked Up'],
    'Picked Up': ['At Local Office'],
    'At Local Office': ['Out for Local Delivery', 'In Transit to Regional Hub'],
    'Out for Local Delivery': ['Delivery Attempted', 'Damaged in Transit', 'Lost in Transit', 'Delivered'],
    'In Transit to Regional Hub': ['At Regional Hub'],
    'At Regional Hub': ['In Transit to Main Branch', 'In Transit to Destination Local Office'],
    'In Transit to Main Branch': ['At Main Branch'],
    'In Transit to Destination Local Office': ['At Destination Local Office'],
    'At Main Branch': ['In Transit to Destination Main Branch', 'In Transit to Destination Regional Hub'],
    'At Destination Local Office': ['Out for Delivery'],
    'Out for Delivery': ['Delivery Attempted', 'Damaged in Transit', 'Lost in Transit', 'Delivered'],
    'In Transit to Destination Main Branch': ['At Destination Main Branch'],
    'In Transit to Destination Regional Hub': ['At Destination Regional Hub'],
    'At Destination Main Branch': ['In Transit to Destination Regional Hub'],
    'At Destination Regional Hub': ['In Transit to Destination Local Office'],
  };

  const fetchBranches = async (status) => {
    try {
      let apiUrl = '';
      if (['At Local Office', 'At Destination Local Office'].includes(status)) {
        apiUrl = '/api/branch/local-office/listAll';
      } else if (['At Regional Hub', 'At Destination Regional Hub'].includes(status)) {
        apiUrl = '/api/branch/regional-hub/listAll';
      } else if (['At Main Branch', 'At Destination Main Branch'].includes(status)) {
        apiUrl = '/api/branch/main-branch/list';
      }

      if (apiUrl) {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setBranches(data);
      } else {
        setBranches([]);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleStatusSelection = (e) => {
    const selectedStatus = e.target.value;
    setUpdateOptions([selectedStatus]);
  
    if (['At Local Office', 'At Destination Local Office', 'At Regional Hub', 'At Destination Regional Hub', 'At Main Branch', 'At Destination Main Branch'].includes(selectedStatus)) {
      fetchBranches(selectedStatus); // Call fetchBranches with the selected status
    } else {
      setBranches([]); // Clear branch list if the selected status doesn't match branch-related statuses
    }
  };
  
  const handleStatusUpdate = async (deliveryId, currentStatus) => {
    try {
      const nextStatuses = statusMap[currentStatus] || [];
      if (nextStatuses.length === 0) {
        const response = await fetch(`/api/parcel/trackById/${deliveryId}`);
        const secondLastStatus = await response.json();
        setUpdateOptions(statusMap[secondLastStatus] || []);
      } else {
        setUpdateOptions(nextStatuses);
      }
      setSelectedDelivery({ id: deliveryId, currentStatus });
      setBranches([]); // Clear branches on opening modal
    } catch (error) {
      console.error('Error handling status update:', error);
    }
  };
  
  const updateStatus = async () => {
    try {
      if (!selectedDelivery) return;

      const body = {
        status: updateOptions[0], // Assume the first option is chosen by default
        branch_id: selectedBranch || null,
      };

      const response = await fetch(`/api/parcel/update-status/${selectedDelivery.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok){
        alert('Status updated successfully!');
        setSelectedDelivery(null);
        fetchDeliveries();
      }else{
        alert('Error updating status:', message);
      }
    } catch (error) {
      alert('Error updating status:', error);
      console.error('Error updating status:', error);
    }
  };

  const handleShowContactModal = (delivery) => {
    setContactDetails({
      sender: delivery.sender_contact,
      recipient: delivery.recipient_contact,
    });
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setContactDetails(null);
    setShowContactModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {completed ? 'Completed Deliveries' : 'Assigned Deliveries'}
      </h1>

      {/* Search and Filter */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by sender or recipient"
          className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Deliveries Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-4 px-6 text-left">Sender</th>
              <th className="py-4 px-6 text-left">Recipient</th>
              <th className="py-4 px-6 text-left">Recipient Address</th>
              <th className="py-4 px-6 text-left">Delivery Type</th>
              <th className="py-4 px-6 text-left">Status</th>
              {!completed && <th className="py-4 px-6 text-left">Action</th>}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {deliveries.map((delivery) => (
              <tr key={delivery._id} className="border-b border-gray-300 hover:bg-gray-100">
                <td className="py-4 px-6">{delivery.sender_name}</td>
                <td className="py-4 px-6">{delivery.recipient_name}</td>
                <td className="py-4 px-6">{delivery.recipient_address}</td>
                <td className="py-4 px-6">{delivery.deliveryType}</td>
                <td className="py-4 px-6">{completed ? "Completed" : delivery.status}</td>
                {!completed && (
                  <td className="py-4 px-6 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleStatusUpdate(delivery._id, delivery.status)}
                    >
                      Update Status
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleShowContactModal(delivery)}
                    >
                      See Contact
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setLimit((prev) => Math.max(prev - 10, 10))}
          disabled={limit <= 10}
        >
          Previous
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          onClick={() => setLimit((prev) => prev + 10)}
        >
          Next
        </button>
      </div>

      {/* Update Status Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Update Status</h2>
            <p>Current Status: {selectedDelivery.currentStatus}</p>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleStatusSelection}
            >
              <option value="">Select Next Status</option>
              {updateOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {branches.length > 0 && (
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.city}, {branch.state} ({branch.branch_code})
                  </option>
                ))}
              </select>
            )}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={updateStatus}
            >
              Submit
            </button>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4 mx-4 hover:bg-red-600"
              onClick={()=> setSelectedDelivery(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && contactDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Contact Details</h2>
            <p>
              <strong>Sender's Contact:</strong> {contactDetails.sender}
            </p>
            <p>
              <strong>Recipient's Contact:</strong> {contactDetails.recipient}
            </p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
              onClick={closeContactModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>

  );
};

export default AssignedDeliveries;
