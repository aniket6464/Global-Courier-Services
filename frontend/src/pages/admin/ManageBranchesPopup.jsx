import React, { useState, useEffect } from 'react';

const ManageBranchesPopup = ({ head, onClose, onBranchesUpdated }) => {
  const [allBranches, setAllBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState(head.overseeing_branches.map(branch => branch.branch_code));

  useEffect(() => {
    // Fetch all available branches for selection
    fetch('/api/branch/main-branch/read?limit=infinite')
      .then(response => response.json())
      .then(data => {
        // console.log('Fetched branches:', data); // Log to inspect the structure
        if (data && Array.isArray(data.branches)) {
          setAllBranches(data.branches);  // Set the branches from the 'branches' array in the response
        } else {
          console.error('Fetched data is not in the expected format:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching branches:', error);
      });

  }, []);

  const handleAddBranch = (branchCode) => {
    if (!selectedBranches.includes(branchCode)) {
      setSelectedBranches([...selectedBranches, branchCode]);
    }
  };

  const handleRemoveBranch = (branchCode) => {
    setSelectedBranches(selectedBranches.filter(b => b !== branchCode));
  };

  const handleSave = () => {
    // Prepare the branchIds array for the request
    const branchIds = allBranches
      .filter(branch => selectedBranches.includes(branch.branch_code))
      .map(branch => branch._id);  // Assuming the _id is the branch identifier

    // Make request to update branches for the operations head
    fetch(`/api/user/operations-head/manage-branch/${head.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branchIds }),
    })
      .then(() => {
        alert('Branches updated successfully.');
        onBranchesUpdated()
        // onBranchesUpdated(prev =>
        //   prev.map(h =>
        //     h.id === head.id ? { ...h, overseeing_branches: branchIds } : h
        //   )
        // );
        // onClose();
      })
      .catch(error => {
        console.error('Error updating branches:', error);
        alert('Error updating branches.');
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Manage Branches for {head.name}</h3>

        <div className="mb-4">
          <h4 className="font-medium">Assigned Branches:</h4>
          <div className="flex flex-wrap">
            {selectedBranches.map((branchCode, index) => {
              const branch = allBranches.find(b => b.branch_code === branchCode);
              return (
                branch && (
                  <span
                    key={index}
                    className="bg-green-100 text-green-600 px-2 py-1 rounded mr-2 mb-2"
                  >
                    {branch.branch_code}
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveBranch(branchCode)}
                    >
                      Remove
                    </button>
                  </span>
                )
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium">Add Branch:</h4>
          <select
            className="border border-gray-300 p-2 rounded"
            onChange={(e) => handleAddBranch(e.target.value)}
          >
            <option value="">Select a Branch</option>
            {allBranches
              .filter(branch => !selectedBranches.includes(branch.branch_code))
              .map((branch, index) => (
                <option key={index} value={branch.branch_code}>
                  {branch.branch_code} - {branch.city}, {branch.state}
                </option>
              ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageBranchesPopup;
