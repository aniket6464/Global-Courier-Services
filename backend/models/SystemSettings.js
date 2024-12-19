import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
  generalSettings: {
    system_name: { type: String, default: "Global Courier Services" },
    timezone: { type: String, default: "Asia/Kolkata" },
    currency: { type: String, default: "INR" },
    language: { type: String, default: "Hindi" },
    operating_countries: { type: [String], default: ["IN", "BD", "PK"] },
  },
  branchManagementSettings: {
    default_branch_hierarchy: { type: [String], default: ["Main Branch", "Regional Hub", "Local Office"] },
    max_branches: { type: Number, default: 100 },
    default_branch_operating_hours: {
      monday_to_friday: { type: String, default: "9:00 AM - 6:00 PM" },
      weekend: { type: String, default: "Closed" },
    },
  },
  parcelSettings: {
    max_parcel_weight: { type: Number, default: 25 },
    allowed_parcel_types: { type: [String], default: ["Delivery", "Pick up"] },
    parcel_tracking_enabled: { type: Boolean, default: true },
  }
});

export default mongoose.model('SystemSettings', systemSettingsSchema);
