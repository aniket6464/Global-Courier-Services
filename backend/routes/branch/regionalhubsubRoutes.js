import express from 'express';
import { verifyToken } from '../../utils/verifyUser.js';
import {
    createRegionalHub,
    readRegionalHub,
    listRegionalHub,
    updateRegionalHub,
    deleteRegionalHub,
    changeRegionalHubManager,
    getRegionalHubPerformance,
    getPerformanceById,
    listAllRegionalHub,
    readRegionalHubById
} from '../../controllers/branch/regionalHubController.js';

const router = express.Router();

// Routes for Regional Hub Management

// Create
router.post('/create', verifyToken(['admin']), createRegionalHub);

// Read
router.get('/read', verifyToken(['admin']), readRegionalHub);

router.get('/read/:id', verifyToken(['admin']), readRegionalHubById);

router.get('/list', verifyToken(['admin','main branch manager']), listRegionalHub);

router.get('/listAll', verifyToken(['Delivery Personnel', 'operations head']), listAllRegionalHub);

// Update [admin]
router.put('/update/:id', verifyToken(['admin']), updateRegionalHub);

// Delete [admin]
router.delete('/delete/:id', verifyToken(['admin']), deleteRegionalHub);

// Change Manager [admin]
router.patch('/change-manager/:id', verifyToken(['admin','main branch manager']), changeRegionalHubManager);

// Performance 
router.get('/performance', verifyToken(['admin', 'main branch manager', 'operations head']), getRegionalHubPerformance);

// Performance by ID
router.get('/performanceByid', verifyToken(['regional hub manager']), getPerformanceById);

export default router;
