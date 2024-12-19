import mongoose from 'mongoose';

const parcelSchema = new mongoose.Schema({
    tracking_number: {
        type: String,
        required: true,
        unique: true
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
        type: String,
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
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Deliver', 'Pickup'],
        required: true
    },
    status: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deliveryType: {
        type: String,
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
    track_status: [{
        status: {
            type: String,
            required: true
        },
        branch_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        }
    }],
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    updateLock: {
        type: Boolean,
        default: false,
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

const Parcel = mongoose.model('Parcel', parcelSchema);

export default Parcel;
