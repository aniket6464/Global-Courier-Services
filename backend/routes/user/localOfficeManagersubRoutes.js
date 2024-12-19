import express from 'express';
import { verifyToken } from '../../utils/verifyUser.js';
import { ConflictForLocal } from '../../utils/avoidConflict.js';
import {
    createLocalOfficeManager,
    getDashboard,
    updateLocalOfficeManager,
    readLocalOfficeManager,
    changeBranch,
    deleteLocalOfficeManager,
    getLocalOfficeManagerDetails,
    profile
} from '../../controllers/user/localOfficeManagerController.js';

const router = express.Router();

// Routes for Local Office Manager Management

// Create [admin, mbm, rhm]
router.post('/create', verifyToken(['admin', 'main branch manager', 'regional hub manager']), createLocalOfficeManager);

// Dashboard
router.get('/dashboard', verifyToken(['local office manager']), getDashboard);

// Update 
router.put('/update', verifyToken(['local office manager']), updateLocalOfficeManager);

router.get('/profile', verifyToken(['local office manager']), profile);

// Read [admin, mbm, rhm]
router.get('/read', verifyToken(['admin', 'main branch manager', 'regional hub manager']), readLocalOfficeManager);

router.get('/read/:id', verifyToken(['admin', 'main branch manager', 'regional hub manager']), getLocalOfficeManagerDetails);

// Change Branch by ID [admin, mbm, rhm]
router.patch(
    '/change-branch/:id', 
    verifyToken(['admin', 'main branch manager', 'regional hub manager']), 
    ConflictForLocal,
    changeBranch
);

// Delete by ID [admin, mbm, rhm]
router.delete('/delete/:id', verifyToken(['admin', 'main branch manager', 'regional hub manager']), deleteLocalOfficeManager);

export default router;
