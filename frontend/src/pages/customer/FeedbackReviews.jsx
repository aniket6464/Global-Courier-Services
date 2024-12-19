import { useState } from 'react';

const FeedbackReviews = () => {
  const [feedbackType, setFeedbackType] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mocking an API call to submit feedback
    try {
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedbackType, feedback, rating }),
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
    <div className="max-w-lg mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Give Feedback or Review</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Feedback Type Selection */}
        <div>
          <label htmlFor="feedbackType" className="block text-sm font-medium">
            Feedback Type
          </label>
          <select
            id="feedbackType"
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>
              Select Type
            </option>
            <option value="Main Branch">Main Branch</option>
            <option value="Regional Hubs">Regional Hubs</option>
            <option value="Local Offices">Local Offices</option>
          </select>
        </div>

        {/* Rating Selection */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium">
            Rating
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 ${
                  rating >= star ? 'text-yellow-400' : 'text-gray-400'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Textarea */}
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium">
            Feedback/Review
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit Feedback  
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackReviews;
