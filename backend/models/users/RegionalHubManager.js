import mongoose from 'mongoose';

const RegionalHubManagerSchema = new mongoose.Schema(
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
        regional_hub_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
        },
        main_branch_id: {
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

const RegionalHubManager = mongoose.model('RegionalHubManager', RegionalHubManagerSchema);

export default RegionalHubManager;
