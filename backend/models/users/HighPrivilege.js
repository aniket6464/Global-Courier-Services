import mongoose from 'mongoose';

const HighPrivilegeSchema = new mongoose.Schema(
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
        role: {
            type: String,
            enum: ['admin', 'main branch manager', 'operations head'], // Enum to restrict roles
            required: true,
        },
        branch_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch', // Reference to Branch model
        },
        overseeing_branches: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Branch', // Reference to Branch model
            },
        ],
        date_created: {
            type: Date,
            default: Date.now
        }
    },
    
);

const HighPrivilege = mongoose.model('HighPrivilege', HighPrivilegeSchema);

export default HighPrivilege;
