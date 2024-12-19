import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UpdateBranch({ branchType }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    regional_coverage: '',
    promised_delivery_time: '',
    phone: '',
    email: '',
    branch_manager: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch branch details
  useEffect(() => {
    const fetchBranch = async () => {
      const apiEndpoint = `/api/branch/${branchType}/read/${id}`;
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        setFormData({
          street: data.street,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
          country: data.country,
          regional_coverage: data.regional_coverage,
          promised_delivery_time: data.promised_delivery_time,
          phone: data.phone,
          email: data.email,
          branch_manager: data.branch_manager,
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching branch details:', error);
        setIsLoading(false);
      }
    };

    fetchBranch();
  }, [branchType, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiEndpoint = `/api/branch/${branchType}/update/${id}`;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Branch updated successfully!');
        navigate(`/admin/branch-management/list-main`);
      } else {
        const result = await response.json();
        alert(`Error updating branch: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating branch:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleCancel = () =>{
    // Navigate based on user role
    navigate(`/admin/branch-management/list-main`);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Branch</h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
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
              placeholder="Enter delivery time in minutes"
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

          {/* Submit Button */}
          <div className="sm:col-span-2 text-right">
            <button
              type="submit"
              className="mx-2 px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
            >
              Update Branch
            </button>

            <button
                onClick={handleCancel}
                className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
            >
                Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateBranch;
