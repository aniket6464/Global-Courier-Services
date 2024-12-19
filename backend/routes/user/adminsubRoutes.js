import express from 'express';
import { verifyToken } from '../../utils/verifyUser.js';
import {
    getDashboard,
    readComplaint,
    readFeedback,
    readReview,
    readSystemSetting,
    updateSystemSetting,
    updateAdmin,
    profile
} from '../../controllers/user/adminController.js';

const router = express.Router();

// Routes for Admin Management

// Dashboard
router.get('/dashboard', getDashboard);

// Read Complaint [admin, mbm, rhm, lom, dp]
router.get('/read-complaint', verifyToken(['admin', 'main branch manager', 'regional hub manager', 'local office manager', 'Delivery Personnel']), readComplaint);

// Read Feedback [admin, mbm, rhm, lom]
router.get('/read-feedback', verifyToken(['admin', 'main branch manager', 'regional hub manager', 'local office manager']), readFeedback);

// Read Review [admin]
router.get('/read-review', verifyToken(['admin']), readReview);

// Read System Setting [admin]
router.get('/read-system-setting', verifyToken(['admin']), readSystemSetting);

// Update System Setting [admin]
router.put('/update-system-setting', verifyToken(['admin']), updateSystemSetting);

// Update Admin [admin]
router.put('/update', verifyToken(['admin']), updateAdmin);

router.get('/profile', verifyToken(['admin']), profile);

export default router;
