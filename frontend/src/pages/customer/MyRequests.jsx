// import React, { useState, useEffect } from 'react';

// const RequestList = ({ isCustomer }) => {
//   const [requests, setRequests] = useState([]);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [limit, setLimit] = useState(10);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [detailsModal, setDetailsModal] = useState(null); // For popup details

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           `/api/parcel/req-read?search=${search}&status=${statusFilter}&limit=${limit}&page=${page}`
//         );
//         const data = await response.json();
//         setRequests(data.requests);
//         setTotalPages(data.totalPages);
//       } catch (error) {
//         console.error('Error fetching requests:', error);
//       }
//     };
//     fetchData();
//   }, [search, statusFilter, limit, page]);

//   const handleEdit = (id) => {
//     window.location.href = `/edit-request/${id}`;
//   };

//   const handleWithdrawal = async (id) => {
//     try {
//       const response = await fetch(`/api/user/customer/req-withdraw/${id}`, { method: 'DELETE' });
//       if (response.ok) {
//         alert('Request withdrawn successfully');
//         setRequests((prev) => prev.filter((req) => req._id !== id));
//       }
//     } catch (error) {
//       console.error('Error withdrawing request:', error);
//     }
//   };

//   const handleAccept = async (id) => {
//     try {
//       const response = await fetch(`/api/parcel/req-res/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'Accepted' }),
//       });

//       if (response.ok) {
//         alert('Request accepted successfully');
//         setRequests((prev) => prev.filter((req) => req._id !== id));
//       }
//     } catch (error) {
//       alert('Error accepting request:', error);
//       console.error('Error accepting request:', error);
//     }
//   };

//   const handleReject = async (id) => {
//     try {
//       const response = await fetch(`/api/parcel/req-res/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'Rejected' }),
//       });
//       if (response.ok) {
//         alert('Request rejected successfully');
//         fetchData();
//       }
//     } catch (error) {
//       alert('Error rejecting request:', error);
//       console.error('Error rejecting request:', error);
//     }
//   };

//   const handleSeeDetails = async (id) => {
//     try {
//       const response = await fetch(`/api/parcel/req-read/${id}`);
//       const data = await response.json();
//       setDetailsModal(data);
//     } catch (error) {
//       console.error('Error fetching details:', error);
//     }
//   };

//   const closeModal = () => setDetailsModal(null);

//   const handlePagination = (direction) => {
//     setPage((prev) => Math.max(1, Math.min(totalPages, prev + direction)));
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4 text-center">
//         {isCustomer ? 'My Requests' : 'Customer Requests'}
//       </h1>

//       {/* Search and Filters */}
//       <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6 bg-gray-100 p-4 rounded-lg shadow">
//         <input
//           type="text"
//           placeholder="Search by Sender or Recipient"
//           className="input input-bordered w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <select
//           className="select select-bordered w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="">All Statuses</option>
//           <option value="Pending">Pending</option>
//           <option value="Rejected">Rejected</option>
//         </select>

//         <select
//           className="select select-bordered w-full md:w-1/6 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           value={limit}
//           onChange={(e) => setLimit(e.target.value)}
//         >
//           <option value={10}>10</option>
//           <option value={20}>20</option>
//           <option value={50}>50</option>
//         </select>
//       </div>


//       {/* Request List Table */}
//       <div className="overflow-x-auto">
//         <table className="table-auto w-full text-left">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="px-4 py-2">Date</th>
//               <th className="px-4 py-2">Sender Name</th>
//               <th className="px-4 py-2">Recipient Name</th>
//               <th className="px-4 py-2">Status</th>
//               <th className="px-4 py-2">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requests.map((request) => (
//               <tr key={request._id} className="border-t">
//                 <td className="px-4 py-2">{new Date(request.date_created).toLocaleDateString()}</td>
//                 <td className="px-4 py-2">{request.sender_name}</td>
//                 <td className="px-4 py-2">{request.recipient_name}</td>
//                 <td
//                   className={`px-4 py-2 font-semibold ${
//                     request.request_status === 'Pending'
//                       ? 'text-yellow-500'
//                       : request.request_status === 'Completed'
//                       ? 'text-green-500'
//                       : 'text-red-500'
//                   }`}
//                 >
//                   {request.request_status}
//                 </td>
//                 <td className="px-4 py-2 flex space-x-2">
//                   {request.request_status === 'Pending' ? (
//                     isCustomer ? (
//                       <>
//                         <button className="btn btn-sm btn-primary" onClick={() => handleEdit(request._id)}>
//                           Edit
//                         </button>
//                         <button className="btn btn-sm btn-danger" onClick={() => handleWithdrawal(request._id)}>
//                           Withdraw
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <button className="btn btn-sm btn-success" onClick={() => handleAccept(request._id)}>
//                           Accept
//                         </button>
//                         <button className="btn btn-sm btn-danger" onClick={() => handleReject(request._id)}>
//                           Reject
//                         </button>
//                         <button className="btn btn-sm btn-info" onClick={() => handleSeeDetails(request._id)}>
//                           See Details
//                         </button>
//                       </>
//                     )
//                   ) : (
//                     <button className="btn btn-sm btn-secondary">
//                       Action Not Available
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="mt-4 flex justify-between items-center">
//         <button
//           onClick={() => handlePagination(-1)}
//           disabled={page === 1}
//           className={`px-4 py-2 rounded font-medium transition-colors duration-200 
//             ${page === 1 
//               ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
//               : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             }`}
//         >
//           Previous
//         </button>
//         <button
//           onClick={() => handlePagination(1)}
//           disabled={page === totalPages}
//           className={`px-4 py-2 rounded font-medium transition-colors duration-200 
//             ${page === totalPages 
//               ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
//               : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             }`}
//         >
//           Next
//         </button>
//       </div>

//       {/* Details Modal */}
//       {detailsModal && (
//         <div className="modal">
//           <div className="modal-box">
//             <h3 className="font-bold text-lg">Request Details</h3>
//             <p><strong>Sender:</strong> {detailsModal.sender_name}</p>
//             <p><strong>Recipient:</strong> {detailsModal.recipient_name}</p>
//             <p><strong>Status:</strong> {detailsModal.request_status}</p>
//             <h4 className="font-bold mt-2">Parcel Details:</h4>
//             {detailsModal.parcel_details.map((detail) => (
//               <p key={detail._id}>
//                 {`Weight: ${detail.weight}, Dimensions: ${detail.length}x${detail.width}x${detail.height}, Price: ${detail.price}`}
//               </p>
//             ))}
//             <div className="modal-action">
//               <button className="btn" onClick={closeModal}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RequestList;

import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const RequestList = ({ isCustomer }) => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailsModal, setDetailsModal] = useState(null); // For popup details
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/parcel/req-read?search=${search}&status=${statusFilter}&limit=${limit}&page=${page}`
        );
        const data = await response.json();
        setRequests(data.requests);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    fetchData();
  }, [search, statusFilter, limit, page]);

  const handleEdit = (id) => {
    navigate(`/customer/parcel-management/update-request/${id}`);
  };

  const handleWithdrawal = async (id) => {
    try {
      const response = await fetch(`/api/user/customer/req-withdraw/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Request withdrawn successfully');
        setRequests((prev) => prev.filter((req) => req._id !== id));
      }
    } catch (error) {
      console.error('Error withdrawing request:', error);
    }
  };

  const handleAccept = async (id) => {
    try {
      const response = await fetch(`/api/parcel/req-res/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Accepted' }),
      });

      if (response.ok) {
        alert('Request accepted successfully');
        setRequests((prev) => prev.filter((req) => req._id !== id));
      }
    } catch (error) {
      alert('Error accepting request:', error);
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`/api/parcel/req-res/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' }),
      });
      if (response.ok) {
        alert('Request rejected successfully');
        fetchData();
      }
    } catch (error) {
      alert('Error rejecting request:', error);
      console.error('Error rejecting request:', error);
    }
  };

  const handleSeeDetails = async (id) => {
    try {
      const response = await fetch(`/api/parcel/req-read/${id}`);
      const data = await response.json();
      setDetailsModal(data);
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  const closeModal = () => setDetailsModal(null);

  const handlePagination = (direction) => {
    setPage((prev) => Math.max(1, Math.min(totalPages, prev + direction)));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {isCustomer ? 'My Requests' : 'Customer Requests'}
      </h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-6 bg-gray-100 p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search by Sender or Recipient"
          className="input input-bordered w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select select-bordered w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          className="select select-bordered w-full md:w-1/6 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Request List Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-3 border border-gray-300">Date</th>
              <th className="px-4 py-3 border border-gray-300">Sender Name</th>
              <th className="px-4 py-3 border border-gray-300">Recipient Name</th>
              <th className="px-4 py-3 border border-gray-300">Status</th>
              <th className="px-4 py-3 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="odd:bg-white even:bg-gray-100">
                <td className="px-4 py-3 border border-gray-300 text-sm">{new Date(request.date_created).toLocaleDateString()}</td>
                <td className="px-4 py-3 border border-gray-300 text-sm">{request.sender_name}</td>
                <td className="px-4 py-3 border border-gray-300 text-sm">{request.recipient_name}</td>
                <td
                  className={`px-4 py-3 border border-gray-300 font-semibold text-sm ${
                    request.request_status === 'Pending'
                      ? 'text-yellow-600'
                      : request.request_status === 'Completed'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {request.request_status}
                </td>
                <td className="px-4 py-3 border border-gray-300 text-sm">
                  <div className="flex flex-wrap gap-2">
                    {request.request_status === 'Pending' ? (
                      isCustomer ? (
                        <>
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition"
                            onClick={() => handleEdit(request._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition"
                            onClick={() => handleWithdrawal(request._id)}
                          >
                            Withdraw
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600 transition"
                            onClick={() => handleAccept(request._id)}
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition"
                            onClick={() => handleReject(request._id)}
                          >
                            Reject
                          </button>
                          <button
                            className="bg-teal-500 text-white px-3 py-1 rounded shadow hover:bg-teal-600 transition"
                            onClick={() => handleSeeDetails(request._id)}
                          >
                            See Details
                          </button>
                        </>
                      )
                    ) : (
                      <button
                        className="bg-gray-400 text-white px-3 py-1 rounded shadow cursor-not-allowed"
                      >
                        Action Not Available
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePagination(-1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded font-medium transition-colors duration-200 
            ${page === 1 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            }`}
        >
          Previous
        </button>
        <button
          onClick={() => handlePagination(1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded font-medium transition-colors duration-200 
            ${page === totalPages 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            }`}
        >
          Next
        </button>
      </div>

      {/* Details Modal */}
      {detailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-lg font-bold mb-4">Request Details</h2>
            <div className="space-y-3">
              <p><strong>Sender:</strong> {detailsModal.sender_name} (
                {detailsModal.sender_contact}) </p>
              <p>
                <strong>Sender Address:</strong> {detailsModal.sender_address}
              </p>
              <p><strong>Recipient:</strong> {detailsModal.recipient_name} (
                {detailsModal.recipient_contact})</p>
              <p>
                <strong>Recipient Address:</strong>{" "}
                {detailsModal.recipient_address}
              </p>
              <p>
                <strong>Parcel Type :</strong>{" "}
                {detailsModal.type}
              </p>
              <p><strong>Status:</strong> {detailsModal.request_status}</p>
              <h4 className="font-bold mt-4">Parcel Details:</h4>
              <ul className="list-disc ml-5">
                {detailsModal.parcel_details.map((detail, index) => (
                  <li key={index}>
                    <strong>Weight:</strong> {detail.weight} kg,{" "}
                    <strong>Dimensions:</strong> {detail.length}x
                    {detail.width}x{detail.height} cm,{" "}
                    <strong>Price:</strong> ${detail.price}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end mt-4">
                <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestList;

