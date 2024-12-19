import express from 'express';
import { verifyToken } from '../../utils/verifyUser.js';
import {
    createDeliveryPersonnel,
    getDashboard,
    updateDeliveryPersonnel,
    readDeliveryPersonnel,
    assignDelivery,
    getAssignedDeliveries,
    getCompletedDeliveries,
    changeBranch,
    deleteDeliveryPersonnel,
    profile
} from '../../controllers/user/deliveryPersonnelController.js';

const router = express.Router();

// Routes for Delivery Personnel Management

// Create [mbm, rhm, lom]
router.post('/create', verifyToken(['main branch manager', 'regional hub manager', 'local office manager']), createDeliveryPersonnel);

// Dashboard
router.get('/dashboard', verifyToken(['Delivery Personnel']), getDashboard);

// Update [dp]
router.put('/update', verifyToken(['Delivery Personnel']), updateDeliveryPersonnel);

// Read [admin, mbm, rhm, lom]
router.get('/read', verifyToken(['admin', 'main branch manager', 'regional hub manager', 'local office manager']), readDeliveryPersonnel);

// Assign Delivery [lom]
router.post('/assign-delivery/:id', verifyToken(['main branch manager', 'regional hub manager', 'local office manager']), assignDelivery);

// Assigned Deliveries [dp]
router.get('/assigned-deliveries', verifyToken(['Delivery Personnel']), getAssignedDeliveries);

// Completed Deliveries [dp]
router.get('/completed-deliveries', verifyToken(['Delivery Personnel']), getCompletedDeliveries);

router.get('/profile', verifyToken(['Delivery Personnel']), profile);

// Change Branch by ID [admin, mbm, rhm, lom]
router.patch('/change-branch/:id', verifyToken(['admin', 'main branch manager', 'regional hub manager']), changeBranch);

// Delete by ID [admin, mbm, rhm, lom]
router.delete('/delete/:id', verifyToken(['admin', 'main branch manager', 'regional hub manager', 'local office manager']), deleteDeliveryPersonnel);

export default router;
