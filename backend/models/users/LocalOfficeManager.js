// models/LocalOfficeManager.js
import mongoose from 'mongoose';

const LocalOfficeManagerSchema = new mongoose.Schema(
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
        main_branch_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
        },
        regional_hub_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
        },
        local_office_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
        },
        updateLock: {
            type: Boolean,
            default: false,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
    }
);

const LocalOfficeManager = mongoose.model('LocalOfficeManager', LocalOfficeManagerSchema);

export default LocalOfficeManager;
