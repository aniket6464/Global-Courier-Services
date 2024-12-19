import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
    customerName:{
        type: String,
        required: true
    },
    complaintType: {
        type: String,
        enum: ['main branch', 'regional hub', 'local office', 'delivery personnel'],
        required: true
    },
    complaintDescription: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
