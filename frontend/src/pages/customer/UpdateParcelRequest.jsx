import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateParcelRequest = () => {
  const { id } = useParams(); // Extract ID from the URL
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch parcel details by ID
  useEffect(() => {
    const fetchParcelDetails = async () => {
      try {
        const response = await fetch(`/api/parcel/req-read/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch parcel details.");
        }
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParcelDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/user/customer/req-edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update parcel request");
        return;
      }
      alert("Request updated successfully")
      // Navigate to the parcel management page on success
      navigate("/customer/parcel-management/my-requests");
    } catch (err) {
      setError("An error occurred while updating the parcel request.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-8 shadow-lg m-8 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Update Parcel Request</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sender Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Sender Name</label>
              <input
                type="text"
                name="sender_name"
                value={formData.sender_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter sender's name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Sender Contact</label>
              <input
                type="tel"
                name="sender_contact"
                value={formData.sender_contact}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter sender's contact"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Sender Address</label>
              <textarea
                name="sender_address"
                value={formData.sender_address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter sender's address"
                rows="2"
              />
            </div>
          </div>

          {/* Recipient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Recipient Name</label>
              <input
                type="text"
                name="recipient_name"
                value={formData.recipient_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter recipient's name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Recipient Contact</label>
              <input
                type="tel"
                name="recipient_contact"
                value={formData.recipient_contact}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter recipient's contact"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Recipient Address</label>
              <textarea
                name="recipient_address"
                value={formData.recipient_address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter recipient's address"
                rows="2"
              />
            </div>
          </div>

          {/* Parcel Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Parcel Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Deliver">Delivery</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>

          {/* Update Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Update
            </button>

            {error && (
                <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateParcelRequest;
