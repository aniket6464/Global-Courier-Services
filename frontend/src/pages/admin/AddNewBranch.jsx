import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddNewBranch() {
  const [branchType, setBranchType] = useState('');
  const [mainBranches, setMainBranches] = useState([]);
  const [regionalHubs, setRegionalHubs] = useState([]);
  const [formData, setFormData] = useState({
    branchType: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    regional_coverage: '',
    promised_delivery_time: '',
    phone: '',
    email: '',
    manager: '',
    main_branch_id: '',
    regional_hub_id: '',
  });

  const navigate = useNavigate(); // Initialize navigation hook

  // Fetch Main Branches
  useEffect(() => {
    fetch('/api/branch/main-branch/read?limit=infinite')
      .then((res) => res.json())
      .then((data) => setMainBranches(data.branches))
      .catch((error) => console.error('Error fetching main branches:', error));
  }, []);

  // Fetch Regional Hubs
  useEffect(() => {
    fetch('/api/branch/regional-hub/read?limit=infinite')
      .then((res) => res.json())
      .then((data) => setRegionalHubs(data.branches))
      .catch((error) => console.error('Error fetching regional hubs:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let apiEndpoint = '';
    if (formData.branchType === 'main-branch') {
      apiEndpoint = '/api/branch/main-branch/create';
    } else if (formData.branchType === 'regional-hub') {
      apiEndpoint = '/api/branch/regional-hub/create';
    } else if (formData.branchType === 'local-office') {
      apiEndpoint = '/api/branch/local-office/create';
    }

    if (!apiEndpoint) {
      alert('Please select a valid branch type.');
      return;
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Branch created successfully!');
        navigate('/admin/branch-management/list-main'); // Redirect user
      } else {
        alert(`Error creating branch: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className=" p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create Branch</h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {/* Branch Type */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Branch Type</label>
            <select
              name="branchType"
              value={formData.branchType}
              onChange={(e) => {
                handleInputChange(e);
                setBranchType(e.target.value);
              }}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select Branch Type</option>
              <option value="main-branch">Main Branch</option>
              <option value="regional-hub">Regional Hub</option>
              <option value="local-office">Local Office</option>
            </select>
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Street</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter street"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter city"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter state"
            />
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Zip Code</label>
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter zip code"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter country"
            />
          </div>

          {/* Regional Coverage */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Regional Coverage</label>
            <input
              type="text"
              name="regional_coverage"
              value={formData.regional_coverage}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter regional coverage"
            />
          </div>

          {/* Promised Delivery Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Promised Delivery Time</label>
            <input
              type="number"
              name="promised_delivery_time"
              value={formData.promised_delivery_time}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter delivery time in hours"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter phone number"
            />
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter email address"
            />
          </div>

          {/* Main Branch (Only for Regional Hub) */}
          {branchType === 'regional-hub' && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Main Branch</label>
              <select
                name="main_branch_id"
                value={formData.main_branch_id}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select Main Branch</option>
                {mainBranches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branch_code} - {branch.city}, {branch.state}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Regional Hub (Only for Local Office) */}
          {branchType === 'local-office' && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Regional Hub</label>
              <select
                name="regional_hub_id"
                value={formData.regional_hub_id}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select Regional Hub</option>
                {regionalHubs.map((hub) => (
                  <option key={hub._id} value={hub._id}>
                    {hub.branch_code} - {hub.city}, {hub.state}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Button */}
          <div className="sm:col-span-2 text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
            >
              Create Branch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddNewBranch;
