import React, { useState, useEffect } from 'react';
import ManageBranchesPopup from './ManageBranchesPopup';

const ListOperationsHead = () => {
  const [operationsHeads, setOperationsHeads] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOperationsHead, setSelectedOperationsHead] = useState(null);

  // State for search, sort, and limit
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [limit, setLimit] = useState(10);

  const fetchOperationsHeads = async () => {
    try {
      const response = await fetch(
        `/api/user/operations-head/read?search=${searchTerm}&sort=${sortField}&sortOrder=${sortOrder}`
      );
      if (response.ok) {
        const data = await response.json();
        setOperationsHeads(
          data.map((head) => ({
            ...head,
            branches: head.overseeing_branches.map((branch) => branch.branch_code),
          }))
        );
      } else {
        window.alert('Failed to fetch operations heads. Please try again later.');
      }
    } catch (error) {
      window.alert('Error fetching operations heads: ' + error.message);
    }
  };

  useEffect(() => {
    fetchOperationsHeads();
  }, [searchTerm, sortField, sortOrder]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this operations head?')) {
      return;
    }
    try {
      const response = await fetch(`/api/user/operations-head/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setOperationsHeads((prev) => prev.filter((head) => head.id !== id));
        window.alert('Operations head deleted successfully.');
      } else {
        window.alert('Failed to delete operations head. Please try again later.');
      }
    } catch (error) {
      window.alert('Error deleting operations head: ' + error.message);
    }
  };

  const handleManageBranches = (head) => {
    setSelectedOperationsHead(head);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedOperationsHead(null);
  };

  const handleBranchesUpdate = async () => {
    closePopup();
    fetchOperationsHeads();
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Operations Heads</h2>

      {/* Search input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name or email"
        className="border p-2 rounded mb-4 w-full"
      />

      {/* Sort and Limit dropdowns */}
      {/* <div className="flex space-x-4 mb-4">
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <select
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="border p-2 rounded"
        >
          <option value={5}>Show 5</option>
          <option value={10}>Show 10</option>
          <option value={20}>Show 20</option>
        </select>
      </div> */}

      {/* Table */}
      <table className="min-w-full table-auto bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Branches</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {operationsHeads.map((head) => (
            <tr key={head.id} className="border-b">
              <td className="p-3">{head.name}</td>
              <td className="p-3">{head.email}</td>
              <td className="p-3">
                {head.branches.map((branch, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded mr-2 inline-block"
                  >
                    {branch}
                  </span>
                ))}
              </td>
              <td className="p-3">
                <button
                  className="text-red-500 hover:text-red-700 mr-4"
                  onClick={() => handleDelete(head.id)}
                >
                  Delete
                </button>
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleManageBranches(head)}
                >
                  Manage Branches
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Manage Branches Popup */}
      {showPopup && selectedOperationsHead && (
        <ManageBranchesPopup
          head={selectedOperationsHead}
          onClose={closePopup}
          onBranchesUpdated={handleBranchesUpdate}
        />
      )}
    </div>
  );
};

export default ListOperationsHead;
