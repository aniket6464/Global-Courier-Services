import mongoose from 'mongoose';

const performanceMeasureSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    total_parcels: {
        type: Number,
        required: true
    },
    total_delivered_parcel: {
        type: Number,
        required: true
    },
    total_pickup_parcels: {
        type: Number,
        default: 0 
    },
    total_on_time_delivered_parcel: {
        type: Number,
        required: true
    },
    average_delivery_time: {
        type: Number,
        required: true
    },
    delivery_attempted: {
        type: Number,
        required: true
    },
    damaged_in_transit: {
        type: Number,
        required: true
    },
    lost_in_transit: {
        type: Number,
        required: true
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

const localOfficePerformanceLogSchema = new mongoose.Schema({
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

const LocalOfficePerformanceLog = mongoose.model('LocalOfficePerformanceLog', localOfficePerformanceLogSchema);

export default LocalOfficePerformanceLog;
