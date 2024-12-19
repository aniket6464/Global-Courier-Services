import mongoose from 'mongoose';

const mainBranchSchema = new mongoose.Schema({
    branch_code: { type: String, required: true, unique: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: Number, required: true },
    country: { type: String, required: true },
    regional_coverage: { type: String, required: true },
    promised_delivery_time: { type: Number, required: true },
    phone: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now },
    parcel_ids: [{ type: mongoose.Schema.Types.ObjectId }],
    complaint_ids: [{ type: mongoose.Schema.Types.ObjectId }],
    branch_manager: { type: mongoose.Schema.Types.ObjectId },
    performance_tracking: {
        total_parcels: { type: Number, default: 0 },
        total_delivered_parcels: { type: Number, default: 0 },
        total_pickup_parcels: { type: Number, default: 0 },
        total_on_time_delivered_parcels: { type: Number, default: 0 },
        average_delivery_time: { type: Number, default: 0 },
        average_processing_time: { type: Number, default: 0 },
        total_assign_delivery: { type: Number, default: 0 },
        delivery_attempted: { type: Number, default: 0 },
        damaged_in_transit: { type: Number, default: 0 },
        lost_in_transit: { type: Number, default: 0 },
        average_customer_rating: { type: Number, default: 0 },
        total_customers: { type: Number, default: 0 },
        total_complaints: { type: Number, default: 0 },
    },
});

const MainBranch = mongoose.model('MainBranch', mainBranchSchema);
export default MainBranch;
