import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegionalHub = () => {
    const [branches, setBranches] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [limit, setLimit] = useState(5);
    const [mainBranchFilter, setMainBranchFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [mainBranches, setMainBranches] = useState([]);
    const [managers, setManagers] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [selectedManagerId, setSelectedManagerId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedManagerName, setSelectedManagerName] = useState("");
    const navigate = useNavigate();

  // Fetch branch data and manager details sequentially
  useEffect(() => {
    const fetchBranchesAndManagers = async () => {
      console.log("fetchBranchesAndManagers")
      setLoading(true);

      let apiUrl = `/api/branch/regional-hub/read?search=${searchQuery}&sort=${sortBy}&limit=${limit}&page=${currentPage}&main_branch_id=${mainBranchFilter}`;

      try {
        // Fetch branches
        const response = await fetch(apiUrl);
        const data = await response.json();
        setBranches(data.branches);
        setTotalPages(data.totalPages);

        // Fetch manager details
        const updatedBranches = await Promise.all(
          data.branches.map(async (branch) => {
            console.log("updatedBranches")
            if (branch.regional_hub_manager) {
              const managerEndpoint = `/api/user/regional-hub-manager/read/${branch.regional_hub_manager}`;

              try {
                const managerResponse = await fetch(managerEndpoint);
                const managerData = await managerResponse.json();
                return { ...branch, managerName: managerData.name };
              } catch {
                console.error(`Error fetching manager details for branch ${branch._id}`);
              }
            }
            return branch;
          })
        );
        setBranches(updatedBranches);
      } catch (error) {
        console.error("Error fetching branches or managers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchesAndManagers();
  }, [searchQuery, sortBy, limit, mainBranchFilter, currentPage]);

  // Fetch filters for dropdowns
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const mainBranchResponse = await fetch("/api/branch/main-branch/read?limit=infinite");
        const mainBranchData = await mainBranchResponse.json();
        setMainBranches(mainBranchData.branches);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilters();
  }, []);

  // Fetch managers for the modal
  const fetchManagers = async () => {
    const apiUrl = "/api/user/regional-hub-manager/read?limit=100";

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setManagers(data.managers || data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  // Open modal and fetch managers
  const openModal = (branchId) => {
    setSelectedBranchId(branchId);
    fetchManagers();
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedBranchId(null);
    setSelectedManagerId("");
    setIsModalOpen(false);
  };

  // Delete branch
  const deleteBranch = async (branchId) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;

    try {
      const response = await fetch(`/api/branch/regional-hub/delete/${branchId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete branch");
      }

      // Update branch list after deletion
      setBranches((prev) => prev.filter((branch) => branch._id !== branchId));
      window.alert("Branch deleted successfully!");
    } catch (error) {
      console.error("Error deleting branch:", error);
      window.alert(`Error: ${error.message || "An error occurred while deleting the branch"}`);
    }
  };

  // Assign manager
  const assignManager = async () => {
    if (!selectedManagerId || !selectedManagerName) return; // Ensure both ID and Name are selected

    const apiUrl = `/api/branch/regional-hub/change-manager/${selectedBranchId}`;

    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerId: selectedManagerId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to assign manager");
      }

      // Successfully assigned manager
      setBranches((prev) =>
        prev.map((branch) =>
          branch._id === selectedBranchId
            ? {
                ...branch,
                branch_manager: selectedManagerId,
                managerName: selectedManagerName
              }
            : branch
        )
      );
  
      closeModal();
      window.alert("Manager assigned successfully!"); // Success feedback      
    } catch (error) {
      console.error("Error assigning manager:", error);
      window.alert(`Error: ${error.message || "An error occurred while assigning the manager"}`); // Error feedback
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        List of Regional Hubs
      </h2>

      {/* Search, Sort, and Filter Controls */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-md p-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="branch_code">Branch Code</option>
          <option value="city">City</option>
          <option value="state">State</option>
        </select>
        <select
          className="border border-gray-300 rounded-md p-2"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        >
          <option value="5">Limit 5</option>
          <option value="10">Limit 10</option>
          <option value="15">Limit 20</option>
        </select>

          <select
            className="border border-gray-300 rounded-md p-2"
            value={mainBranchFilter}
            onChange={(e) => setMainBranchFilter(e.target.value)}
          >
            <option value="">Filter by Main Branch</option>
            {mainBranches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.branch_code} - {branch.city}
              </option>
            ))}
          </select>

      </div>

      {/* Branch Table */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Branch Code</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">Country</th>
              <th className="py-2 px-4 border-b">Contact</th>
              <th className="py-2 px-4 border-b">Manager</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.length > 0 &&
              branches.map((branch) => (
                <tr key={branch._id}>
                  <td className="py-2 px-4 border-b">{branch.branch_code}</td>
                  <td className="py-2 px-4 border-b">
                    {branch.street}, {branch.city}, {branch.state}, {branch.zip_code}
                  </td>
                  <td className="py-2 px-4 border-b">{branch.country}</td>
                  <td className="py-2 px-4 border-b">
                    {branch.phone} <br /> {branch.email}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {branch.managerName || (
                      <button
                        onClick={() => openModal(branch._id)}
                        className="text-blue-500 underline"
                      >
                        Assign Manager
                      </button>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => deleteBranch(branch._id)}
                      className="text-red-500 mr-4"
                    >
                      🗑️
                    </button>
                    <button
                      onClick={() => navigate(`/admin/branch-management/update-regional/${branch._id}`)}
                      className="text-blue-500"
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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

      {/* Modal */}
      {isModalOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded shadow-lg p-6 w-96">
          <h3 className="text-xl font-semibold mb-4">Assign Manager</h3>
          <select
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
            value={selectedManagerId}
            onChange={(e) => {
            const selectedOption = managers.find(
                (manager) => manager._id === e.target.value
            );
            setSelectedManagerId(selectedOption?._id || "");
            setSelectedManagerName(selectedOption?.name || ""); // Capture name as well
            }}
            >
              <option value="">Select a Manager</option>
              {managers && managers.length > 0 ? (
              managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                  {manager.name} - {manager.email}
                  </option>
              ))
              ) : (
              <option value="">No managers available</option>
              )}
            </select>
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={assignManager}
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

export default RegionalHub