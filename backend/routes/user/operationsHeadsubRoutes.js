import express from 'express';
import { verifyToken } from '../../utils/verifyUser.js';
import {
    createOperationsHead,
    getDashboard,
    readOperationsHead,
    manageBranch,
    updateOperationsHead,
    deleteOperationsHead,
    ParcelTransferEfficiency,
    ParcelDeliveryEfficiency,
    ParcelConditionAnalysis,
    CustomerSatisfaction,
    profile
} from '../../controllers/user/operationsHeadController.js';

const router = express.Router();

// Routes for Operations Head Management

// Create [admin]
router.post('/create', verifyToken(['admin']), createOperationsHead);

// Dashboard
router.get('/dashboard', verifyToken(['operations head']), getDashboard);

// Read [admin]
router.get('/read', verifyToken(['admin']), readOperationsHead);

// Manage Branch [admin]
router.post('/manage-branch/:id', verifyToken(['admin']), manageBranch);

// Update [oh]
router.put('/update', verifyToken(['operations head']), updateOperationsHead);

router.get('/profile', verifyToken(['operations head']), profile);

// Delete [admin]
router.delete('/delete/:id', verifyToken(['admin']), deleteOperationsHead);

// Process Transfer Entries [oh]
router.post('/pte', verifyToken(['operations head']), ParcelTransferEfficiency);

// Process Delivery Entries [oh]
router.post('/pde', verifyToken(['operations head']), ParcelDeliveryEfficiency);

// Process Change Status [oh]
router.post('/pca', verifyToken(['operations head']), ParcelConditionAnalysis);

// Process Customer Service [oh]
router.post('/cs', verifyToken(['operations head']), CustomerSatisfaction);

export default router;
