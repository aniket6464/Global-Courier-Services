import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    customerName:{
        type: String,
        required: true
    },
    feedbackType:{
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
