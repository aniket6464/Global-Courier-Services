import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        enum: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
        required: true
    },
    review: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
