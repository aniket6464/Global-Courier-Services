import React, { useState, useEffect } from 'react';

const ListStaff = ({ staffType }) => {
  const [staffList, setStaffList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branchType, setBranchType] = useState('');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAssignBranchModal, setShowAssignBranchModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStaff();
  }, [staffType, search, currentPage, limit]);

  const fetchStaff = async () => {
    try {
      let url = `/api/user/${staffType}/read?`;
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      if (staffType !== 'main-branch-manager') {
        params.append('page', currentPage);
        params.append('limit', limit);
      }
      url += params.toString();

      const response = await fetch(url);
      const data = await response.json();

      if (staffType === 'main-branch-manager') {
        setStaffList(data);
        setTotalPages(1);
      } else {
        setStaffList(data.managers || data.personnels || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching staff list:', error);
    }
  };

  const fetchBranches = async (type) => {
    try {
      let url = `/api/branch/${type}/list`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setBranches(data);
        setError('');
      } else {
        setError(data.message || 'Access Denied');
        setBranches([]);
      }
    } catch (error) {
      setError('Error fetching branches.');
      console.error('Error fetching branches:', error);
    }
  };

  const handleAssignBranch = (staff) => {
    setSelectedStaff(staff);
    setShowAssignBranchModal(true);
    if (staffType === 'delivery-personnel') setBranchType(''); // Reset for delivery personnel
    else fetchBranches(branchTypeForStaff(staffType));
  };

  const branchTypeForStaff = (type) => {
    if (type === 'main-branch-manager') return 'main-branch';
    if (type === 'regional-hub-manager') return 'regional-hub';
    if (type === 'local-office-manager') return 'local-office';
    return '';
  };

  const assignBranch = async () => {
    if (!selectedBranch || (staffType === 'delivery-personnel' && !branchType)) {
      window.alert('Please select a branch (and type for delivery personnel).');
      return;
    }

    try {
      const body = { branch_id: selectedBranch };
      if (staffType === 'delivery-personnel') body.branch_type = branchType.replace('-', ' ')
        .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

      const url = `/api/user/${staffType}/change-branch/${selectedStaff._id}`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        window.alert('Branch assigned successfully.');
        setShowAssignBranchModal(false);
        fetchStaff(); // Refresh staff list
      } else {
        const errorData = await response.json();
        window.alert(`Failed to assign branch: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error assigning branch:', error);
      window.alert('An error occurred while assigning the branch. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    // Display a confirmation dialog before deletion
    const confirmDelete = window.confirm("Are you sure you want to delete this staff member? This action cannot be undone.");
    if (!confirmDelete) return; // Exit if the user cancels
  
    try {
      const response = await fetch(`/api/user/${staffType}/delete/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Notify success and refresh the staff list
        window.alert("Staff member deleted successfully.");
        setStaffList(staffList.filter((staff) => staff._id !== id));
      } else {
        // Show an error message for non-200 responses
        window.alert(`Failed to delete staff member: ${response.statusText}`);
        console.error('Failed to delete staff member:', response.statusText);
      }
    } catch (error) {
      // Handle network or unexpected errors
      window.alert("An error occurred while trying to delete the staff member. Please try again later.");
      console.error('Error deleting staff member:', error);
    }
  };  

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {staffType.replace('-', ' ').toUpperCase()} List
      </h2>

      {/* Search and Limit */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name or email"
          className="border border-gray-300 rounded-md p-2 w-full"
        />
        {staffType !== 'main-branch-manager' && (
          <select
            value={limit}
            onChange={handleLimitChange}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        )}
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Branch</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {staffList.map((staff) => (
              <tr key={staff._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{staff.name}</td>
                <td className="py-3 px-6 text-left">{staff.email}</td>
                <td className="py-3 px-6 text-left">
                  
                  {staff.branch && staff.branch.branch_code
                    ? `${staff.branch.branch_code} - ${staff.branch.city}, ${staff.branch.state}`
                    : (
                      <button
                        onClick={() => handleAssignBranch(staff)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                      >
                        Assign Branch
                      </button>
                    )}
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleDelete(staff._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {staffType !== 'main-branch-manager' && (
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => handlePageChange('prev')}
            className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => handlePageChange('next')}
            className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentPage === totalPages}
          >
            Next Page
          </button>
        </div>
      )}

      {/* Assign Branch Modal */}
      {showAssignBranchModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Assign Branch</h3>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : staffType === 'delivery-personnel' ? (
              <>
                <select
                  value={branchType}
                  onChange={(e) => {
                    setBranchType(e.target.value);
                    fetchBranches(e.target.value);
                  }}
                  className="mb-4 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Branch Type</option>
                  <option value="main-branch">Main Branch</option>
                  <option value="regional-hub">Regional Hub</option>
                  <option value="local-office">Local Office</option>
                </select>
              </>
            ) : null}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Select a Branch</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.branch_code} - {branch.city}, {branch.state}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAssignBranchModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={assignBranch}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListStaff;
