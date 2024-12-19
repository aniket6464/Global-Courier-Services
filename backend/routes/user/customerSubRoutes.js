import express from 'express';
import { verifyToken } from '../../utils/verifyUser.js';
import {
    getCustomerDashboard,
    updateCustomer,
    createRequest,
    editRequest,
    withdrawRequest,
    readParcel,
    rateParcel,
    getParcelHistory,
    fileComplaint,
    submitFeedback,
    writeReview,
    profile
} from '../../controllers/user/customerController.js';

const router = express.Router();

// Routes for Customer Management

// Dashboard
router.get('/dashboard', verifyToken(['Customer']), getCustomerDashboard);

// Update
router.put('/update', verifyToken(['Customer']), updateCustomer);

// Request Create [c]
router.post('/req-create', verifyToken(['Customer']), createRequest);

// Request Edit by ID [c]
router.put('/req-edit/:id', verifyToken(['Customer']), editRequest);

// Request Withdraw [c]
router.delete('/req-withdraw/:id', verifyToken(['Customer']), withdrawRequest);

// Read Parcel [c]
router.get('/read-parcel', verifyToken(['Customer']), readParcel);

// Rating by ID [c]
router.post('/rating/:id', verifyToken(['Customer']), rateParcel);

// Parcel History [c]
router.get('/parcel-history', verifyToken(['Customer']), getParcelHistory);

// Complaint [c]
router.post('/complaint', verifyToken(['Customer']), fileComplaint);

// Feedback [c]
router.post('/feedback', verifyToken(['Customer']), submitFeedback);

// Review [c]
router.post('/review', verifyToken(['Customer']), writeReview);

router.get('/profile', verifyToken(['Customer']), profile);

export default router;
