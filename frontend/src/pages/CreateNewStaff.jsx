import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreateNewStaff = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    // Dynamically fetch branch data based on role
    if (role) {
      const roleToApiMap = {
        'regional hub manager': '/api/branch/regional-hub/list',
        'local office manager': '/api/branch/local-office/list',
      };

      if (roleToApiMap[role]) {
        fetch(roleToApiMap[role])
          .then((res) => res.json())
          .then((data) => setBranches(data || []))
          .catch((err) => console.error('Error fetching branches:', err));
      }
    }
  }, [role]);

  // Filter allowed roles based on the current user's role
  const getAllowedRoles = () => {
    if (currentUser.role === 'main branch manager') {
      return ['regional hub manager', 'local office manager', 'delivery personnel'];
    } else if (currentUser.role === 'regional hub manager') {
      return ['local office manager', 'delivery personnel'];
    } else if (currentUser.role === 'local office manager') {
      return ['delivery personnel'];
    }
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roleToApiMap = {
      'regional hub manager': '/api/user/regional-hub-manager/create',
      'local office manager': '/api/user/local-office-manager/create',
      'delivery personnel': '/api/user/delivery-personnel/create',
    };

    const payload = {
      name,
      email,
      password,
      ...(role === 'regional hub manager' && { regional_hub_id: selectedBranch }),
      ...(role === 'local office manager' && { local_office_id: selectedBranch }),
    };

    try {
      const response = await fetch(roleToApiMap[role], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        window.alert('Staff member created successfully!');
        if (currentUser.role === 'main branch manager'){
            navigate('/main-branch-manager/staff-management/list-regional-hub-manager');
        }else if (currentUser.role === 'regional hub manager'){
            navigate('/regional-hub-manager/staff-management/list-local-office-manager');
        }else if (currentUser.role === 'local office manager'){
            navigate('/local-office-manager/staff-management/list-delivery-personnel');
        }
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
              {getAllowedRoles().map((allowedRole) => (
                <option key={allowedRole} value={allowedRole}>
                  {allowedRole.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {(role === 'regional hub manager' || role === 'local office manager') && (
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">Branch</label>
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
            </div>
          )}

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
