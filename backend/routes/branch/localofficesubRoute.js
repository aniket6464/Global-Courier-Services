import express from 'express';
import { verifyToken } from '../../utils/verifyUser.js';
import {
    createLocalOffice,
    readLocalOffice,
    listLocalOffice,
    updateLocalOffice,
    deleteLocalOffice,
    changeLocalOfficeManager,
    getLocalOfficePerformance,
    getLocalOfficePerformanceById,
    listAllLocalOffice,
    readLocalOfficeById
} from '../../controllers/branch/localOfficeController.js';

const router = express.Router();

// Routes for Local Office Management

// Create [admin]
router.post('/create', verifyToken(['admin']), createLocalOffice);

// Read [admin]
router.get('/read', verifyToken(['admin']), readLocalOffice);

router.get('/read/:id', verifyToken(['admin']), readLocalOfficeById);

router.get('/list', verifyToken(['admin','main branch manager', 'regional hub manager','Customer']), listLocalOffice);

router.get('/listAll', verifyToken(['Delivery Personnel', 'operations head']), listAllLocalOffice);

// Update [admin]
router.put('/update/:id', verifyToken(['admin']), updateLocalOffice);

// Delete [admin]
router.delete('/delete/:id', verifyToken(['admin']), deleteLocalOffice);

// Change Manager [admin]
router.patch('/change-manager/:id', verifyToken(['admin', 'main branch manager', 'regional hub manager']), changeLocalOfficeManager);

// Performance [admin, mbm, rhm, oh]
router.get('/performance', verifyToken(['admin', 'main branch manager', 'regional hub manager', 'operations head']), getLocalOfficePerformance);

// Performance by ID [admin, lom, oh]
router.get('/performanceByid', verifyToken(['local office manager']), getLocalOfficePerformanceById);

export default router;
