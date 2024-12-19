import mongoose from 'mongoose';

const parcelRequestSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Adjust according to your customer model
        required: true
    },
    sender_name: {
        type: String,
        required: true
    },
    sender_address: {
        type: String,
        required: true
    },
    sender_contact: {
        type: Number,
        required: true
    },
    recipient_name: {
        type: String,
        required: true
    },
    recipient_address: {
        type: String,
        required: true
    },
    recipient_contact: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Deliver', 'Pickup'],
        required: true
    },
    request_status: {
        type: String,
        required: true
    },
    parcel_details: [{
        weight: {
            type: String,
            required: true
        },
        height: {
            type: String,
            required: true
        },
        width: {
            type: String,
            required: true
        },
        length: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    branch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch' // Adjust according to your branch model
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

const ParcelRequest = mongoose.model('ParcelRequest', parcelRequestSchema);

export default ParcelRequest;
