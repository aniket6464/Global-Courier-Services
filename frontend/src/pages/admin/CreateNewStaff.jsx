import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNewStaff = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (role) {
      const roleToApiMap = {
        'operations-head': '/api/branch/main-branch/read?limit=1e9',
        'main-branch-manager': '/api/branch/main-branch/read?limit=1e9',
        'regional-hub-manager': '/api/branch/regional-hub/read?limit=10000',
        'local-office-manager': '/api/branch/local-office/read?limit=10000',
      };

      fetch(roleToApiMap[role])
        .then((res) => res.json())
        .then((data) => setBranches(data.branches))
        .catch((err) => console.error('Error fetching branches:', err));
    }
  }, [role]);

  // Handle adding a branch to the selected branches list
  const handleAddBranch = (branchId) => {
    if (!selectedBranches.includes(branchId)) {
      setSelectedBranches([...selectedBranches, branchId]);
    }
  };

  // Handle removing a branch from the selected branches list
  const handleRemoveBranch = (branchId) => {
    setSelectedBranches(selectedBranches.filter((id) => id !== branchId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roleToApiMap = {
      'operations-head': '/api/user/operations-head/create',
      'main-branch-manager': '/api/user/main-branch-manager/create',
      'regional-hub-manager': '/api/user/regional-hub-manager/create',
      'local-office-manager': '/api/user/local-office-manager/create',
    };

    const payload = {
      name,
      email,
      password,
      ...(role === 'operations-head' && { overseeing_branches: selectedBranches }),
      ...(role === 'main-branch-manager' && { branch_id: selectedBranch }),
      ...(role === 'regional-hub-manager' && { regional_hub_id: selectedBranch }),
      ...(role === 'local-office-manager' && { local_office_id: selectedBranch }),
    };

    try {
      const response = await fetch(roleToApiMap[role], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        window.alert('Staff member created successfully!');
        navigate('/admin/staff-management/list-operations-head');
      } else {
        const errorData = await response.json();
        window.alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating staff member:', error);
      window.alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Create New Staff</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter staff name"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="operations-head">Operations Head</option>
              <option value="main-branch-manager">Main Branch Manager</option>
              <option value="regional-hub-manager">Regional Hub Manager</option>
              <option value="local-office-manager">Local Office Manager</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Assign Branch{role === 'operations-head' ? 'es' : ''}</label>
            {role === 'operations-head' ? (
              <div>
                <select
                  className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
                  value=""
                  onChange={(e) => handleAddBranch(e.target.value)}
                >
                  <option value="" disabled>
                    Select a branch to add
                  </option>
                  {branches
                    .filter((branch) => !selectedBranches.includes(branch._id)) // Exclude already selected branches
                    .map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.city}, {branch.state} ({branch.branch_code})
                      </option>
                    ))}
                </select>

                <div className="mt-3">
                  {selectedBranches.map((branchId) => {
                    const branch = branches.find((b) => b._id === branchId);
                    if (!branch) return null;
                    return (
                      <div
                        key={branchId}
                        className="flex items-center justify-between border-b border-gray-300 py-2"
                      >
                        <span>
                          {branch.city}, {branch.state} ({branch.branch_code})
                        </span>
                        <button
                          type="button"
                          className="text-red-500 hover:underline"
                          onClick={() => handleRemoveBranch(branchId)}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <select
                className="mt-1 border border-gray-300 rounded-md p-2 w-full focus:ring-blue-500 focus:border-blue-500"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.city}, {branch.state} ({branch.branch_code})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Create Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewStaff;
