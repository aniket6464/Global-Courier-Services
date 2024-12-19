import mongoose from 'mongoose';

const performanceTrackingSchema = new mongoose.Schema({
  total_delivered_parcels: { type: Number, default: 0 },
  total_pickup_parcels: { type: Number, default: 0 },
  average_delivery_time: { type: Number, default: 0 },
  average_processing_time: { type: Number, default: 0 },
  total_assign_delivery: {type: Number, default: 0},
  average_customer_rating: { type: Number, default: 0 },
  total_customers: { type: Number, default: 0 },
  total_complaints: { type: Number, default: 0 },
});

const performanceTracking = mongoose.model('performanceTracking', performanceTrackingSchema);

export default performanceTracking;
