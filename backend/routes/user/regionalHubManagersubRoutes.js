import express from 'express';
import { verifyToken } from '../../utils/verifyUser.js';
import { ConflictForRegional } from '../../utils/avoidConflict.js';
import {
    createRegionalHubManager,
    getDashboard,
    updateRegionalHubManager,
    readRegionalHubManager,
    changeBranch,
    deleteRegionalHubManager,
    getRegionalHubManagerDetails,
    profile
} from '../../controllers/user/regionalHubManagerController.js';

const router = express.Router();

// Routes for Regional Hub Manager Management

// Create [admin, mbm]
router.post('/create', verifyToken(['admin', 'main branch manager']), createRegionalHubManager);

// Dashboard
router.get('/dashboard', verifyToken(['regional hub manager']), getDashboard);

// Update
router.put('/update', verifyToken(['regional hub manager']), updateRegionalHubManager);

router.get('/profile', verifyToken(['regional hub manager']), profile);

// Read [admin, mm]
router.get('/read', verifyToken(['admin', 'main branch manager']), readRegionalHubManager);

router.get('/read/:id', verifyToken(['admin', 'main branch manager']), getRegionalHubManagerDetails);

// Change Branch by ID [admin, mbm]
router.patch(
    '/change-branch/:id', 
    verifyToken(['admin', 'main branch manager']), 
    ConflictForRegional,
    changeBranch
);

// Delete by ID [admin, mbm]
router.delete('/delete/:id', verifyToken(['admin', 'main branch manager']), deleteRegionalHubManager);

export default router;
