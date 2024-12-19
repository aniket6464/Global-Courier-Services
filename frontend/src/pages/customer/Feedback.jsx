import { useState } from 'react';

const Feedback = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/user/customer/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedbackType, feedback }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Error submitting feedback. Please try again later.');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting feedback. Please try again later.');
    }
  };

  if (submitted) {
    return (
      <div className="p-6 bg-green-100 rounded-md">
        <h2 className="text-xl font-semibold text-green-700">Thank you for your feedback!</h2>
        <p>Your feedback helps us improve our services.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-12 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Give Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="feedbackType" className="block text-sm font-medium">Feedback Type</label>
          <select
            id="feedbackType"
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select Type</option>
            <option value="Main Branch">Main Branch</option>
            <option value="Regional Hubs">Regional Hubs</option>
            <option value="Local Offices">Local Offices</option>
          </select>
        </div>
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium">Feedback</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            required
          />
        </div>
        <div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit Feedback</button>
        </div>
      </form>
    </div>
  );
};

export default Feedback;
