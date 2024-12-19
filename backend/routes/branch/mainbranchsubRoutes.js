import express from 'express';
import { verifyToken } from '../../utils/verifyUser.js';
import {
    createBranch,
    readBranch,
    updateBranch,
    deleteBranch,
    changeManager,
    getPerformance,
    getPerformanceById,
    listBranch,
    readBranchById
} from '../../controllers/branch/MainBranchController.js';

const router = express.Router();

// Routes for Main Branch Management

// Create [admin] 
router.post('/create', verifyToken(['admin']), createBranch);

// Read [admin] 
router.get('/read', verifyToken(['admin']), readBranch);

router.get('/read/:id', verifyToken(['admin']), readBranchById);

// list [admin] 
router.get('/list', verifyToken(['admin','Delivery Personnel', 'operations head']), listBranch);

// Update [admin] 
router.put('/update/:id', verifyToken(['admin']), updateBranch);

// Delete [admin] 
router.delete('/delete/:id', verifyToken(['admin']), deleteBranch);

// Change Manager [admin]
router.patch('/change-manager/:id', verifyToken(['admin']), changeManager);

// Performance [admin, oh] 
router.get('/performance', verifyToken(['admin', 'operations head']), getPerformance);

// Performance by ID [admin, mbm, oh] 
router.get('/performanceByid', verifyToken(['main branch manager']), getPerformanceById);

export default router;
