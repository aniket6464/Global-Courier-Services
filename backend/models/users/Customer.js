import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
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
        contact: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        order_history: [
            {
                parcel_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Parcel',
                    required: true,
                },
                status: {
                    type: String,
                    enum: ['completed', 'pending'],
                    required: true,
                },
            },
        ],
        created_at: {
            type: Date,
            default: Date.now,
        },
    }
);

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;
