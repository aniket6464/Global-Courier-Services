import mongoose from 'mongoose';

const performanceMeasureSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    total_parcels: {
        type: Number,
        default: 0 
    },
    total_delivered_parcel: {
        type: Number,
        default: 0 
    },
    total_pickup_parcels: {
        type: Number,
        default: 0 
    },
    total_on_time_delivered_parcel: {
        type: Number,
        default: 0 
    },
    average_delivery_time: {
        type: Number,
        default: 0 
    },
    average_processing_time: {
        type: Number,
        default: 0 
    },
    total_assign_delivery: { 
        type: Number, 
        default: 0 
    },
    delivery_attempted: {
        type: Number,
        default: 0 
    },
    damaged_in_transit: {
        type: Number,
        default: 0 
    },
    lost_in_transit: {
        type: Number,
        default: 0 
    },
    average_customer_rating: {
        type: Number,
        min: 0,
        max: 5
    },
    total_customers: { 
        type: Number, 
        default: 0 
    },
    total_complaints: {
        type: Number,
        required: true
    }
});

const mainBranchPerformanceLogSchema = new mongoose.Schema({
    branch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch', 
        required: true
    },
    performance_measure: {
        type: [performanceMeasureSchema],
        required: true
    }
});

const MainBranchPerformanceLog = mongoose.model('MainBranchPerformanceLog', mainBranchPerformanceLogSchema);

export default MainBranchPerformanceLog;
