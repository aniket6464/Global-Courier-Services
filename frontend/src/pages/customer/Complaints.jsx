import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Complaints = () => {
  const [trackingId, setTrackingId] = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const complaintData = {
      trackingId,
      complaintType,
      complaintDescription,
    };

    try {
      // API call to submit the complaint
      const response = await fetch('/api/user/customer/complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the complaint. Please try again.');
      }

      setSuccessMessage('Your complaint has been submitted successfully.');
      setErrorMessage('');

      // Reset form
      setTrackingId('');
      setComplaintType('');
      setComplaintDescription('');

      // Navigate to parcel history
      setTimeout(() => {
        navigate('/customer/parcel-management/parcel-history');
      }, 2000); // Delay to show the success message before redirecting
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-4">Submit a Complaint</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Parcel Tracking ID */}
        <div>
          <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700">
            Parcel Tracking ID
          </label>
          <input
            type="text"
            id="trackingId"
            className="w-full p-2 border rounded-md"
            placeholder="Enter tracking number"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
          />
        </div>

        {/* Complaint Type */}
        <div>
          <label htmlFor="complaintType" className="block text-sm font-medium text-gray-700">
            Complaint Type
          </label>
          <select
            id="complaintType"
            className="w-full p-2 border rounded-md"
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
            required
          >
            <option value="" disabled>
              Select complaint type
            </option>
            <option value="main branch">Main Branch</option>
            <option value="Regional Hubs">Regional Hubs</option>
            <option value="local office">Local Offices</option>
            <option value="delivery personnel">Delivery Personnel</option>
          </select>
        </div>

        {/* Complaint Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Complaint Description
          </label>
          <textarea
            id="description"
            className="w-full p-2 border rounded-md"
            placeholder="Describe your complaint..."
            value={complaintDescription}
            onChange={(e) => setComplaintDescription(e.target.value)}
            rows="4"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default Complaints;
