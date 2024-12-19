// models/DeliveryPersonnel.js
import mongoose from 'mongoose';

const DeliveryPersonnelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        branch_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
            required: true,
        },
        branch_type: {
            type: String,
            enum: ['Main Branch', 'Regional Hub', 'Local Office'],
            required: true,
        },
        parcels: [
            {
                parcel_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Parcel',
                    required: true,
                },
                status: {
                    type: String,
                    enum: ['pending', 'completed'],
                    required: true,
                },
                deliveryType: {
                    type: String,
                    required: true,
                },
            },
        ],
        complaint_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
        created_at: {
            type: Date,
            default: Date.now,
        },
    }
);

const DeliveryPersonnel = mongoose.model('DeliveryPersonnel', DeliveryPersonnelSchema);

export default DeliveryPersonnel;
