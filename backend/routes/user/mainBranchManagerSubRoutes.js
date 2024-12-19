import express from 'express';
import { verifyToken } from '../../utils/verifyUser.js';
import {
    createMainBranchManager,
    getDashboard,
    updateMainBranchManager,
    readMainBranchManager,
    changeBranch,
    deleteMainBranchManager,
    getMainBranchManagerDetails,
    profile
} from '../../controllers/user/mainBranchManagerController.js';

const router = express.Router();

// Routes for Main Branch Manager Management

// Create [admin]
router.post('/create', verifyToken(['admin']), createMainBranchManager);

// Dashboard
router.get('/dashboard', verifyToken(['main branch manager']), getDashboard);

// Update [mbm]
router.put('/update', verifyToken(['main branch manager']), updateMainBranchManager);

router.get('/profile', verifyToken(['main branch manager']), profile);

// Read [admin]
router.get('/read', verifyToken(['admin']), readMainBranchManager);

router.get('/read/:id', verifyToken(['admin']), getMainBranchManagerDetails);

// Change Branch
router.patch('/change-branch/:id', changeBranch);

// Delete
router.delete('/delete/:id', deleteMainBranchManager);

export default router;
