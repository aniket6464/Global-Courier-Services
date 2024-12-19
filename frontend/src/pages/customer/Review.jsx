import { useState } from 'react';

const Review = () => {
  const [experience, setExperience] = useState('');
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/user/customer/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ experience, review }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Error submitting review. Please try again later.');
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting review. Please try again later.');
    }
  };

  if (submitted) {
    return (
      <div className="p-6 bg-green-100 rounded-md">
        <h2 className="text-xl font-semibold text-green-700">Thank you for your review!</h2>
        <p>Your feedback helps us improve our services.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 mt-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">How would you rate your experience?</label>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="experience" 
                value="Excellent" 
                checked={experience === "Excellent"} 
                onChange={(e) => setExperience(e.target.value)} 
                className="mr-2" 
                required 
              />
              Excellent
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="experience" 
                value="Very Good" 
                checked={experience === "Very Good"} 
                onChange={(e) => setExperience(e.target.value)} 
                className="mr-2" 
              />
              Very Good
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="experience" 
                value="Good" 
                checked={experience === "Good"} 
                onChange={(e) => setExperience(e.target.value)} 
                className="mr-2" 
              />
              Good
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="experience" 
                value="Fair" 
                checked={experience === "Fair"} 
                onChange={(e) => setExperience(e.target.value)} 
                className="mr-2" 
              />
              Fair
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="experience" 
                value="Poor" 
                checked={experience === "Poor"} 
                onChange={(e) => setExperience(e.target.value)} 
                className="mr-2" 
              />
              Poor
            </label>
          </div>
        </div>


        {/* Textarea for Review */}
        <div>
          <label htmlFor="review" className="block text-sm font-medium">Write your review</label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Tell us more about your experience"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default Review;
