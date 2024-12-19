import express from 'express';
import { 
    verifyToken, 
    authorizeParcelAccess, 
    getParcelIdsMiddleware 
} from '../utils/verifyUser.js';
import { avoidConflict } from '../utils/avoidConflict.js';
import {
    readRequests,
    resolveRequest,
    readRequestById,
    createParcel,
    readParcels,
    readParcelById,
    updateParcel,
    updateParcelStatus,
    deleteParcel,
    trackParcel,
    generateParcelStatusReport,
    trackParcelByid
} from '../controllers/parcelController.js';

const router = express.Router();

// Routes for Parcel Management

// Read Requests [lom, c]
router.get('/req-read', verifyToken(['local office manager', 'Customer']), readRequests);

// Resolve Request by ID [lom]
router.put('/req-res/:id', verifyToken(['local office manager']), resolveRequest);

// Read Request by ID [lom]
router.get('/req-read/:id', verifyToken(['local office manager', 'Customer']), readRequestById);

// Create Parcel [admin, mbm, rhm, lom]
router.post('/create', verifyToken(['main branch manager', 'regional hub manager', 'local office manager']), createParcel);

// Read Parcels [admin, mbm, rhm, lom]
router.get(
    '/read',
    verifyToken(['admin', 'main branch manager', 'regional hub manager', 'local office manager']),
    getParcelIdsMiddleware, // Pass the middleware without invoking it
    readParcels
);

// Read Parcel by ID [admin, mbm, rhm, lom, c]
router.get(
    '/read/:id',
    verifyToken(['admin', 'main branch manager', 'regional hub manager', 'local office manager', 'Customer']),
    authorizeParcelAccess, // Middleware to authorize parcel access
    readParcelById
);

// Update Parcel by ID [mbm, rhm, lom]
router.put(
    '/update/:id',
    verifyToken(['main branch manager', 'regional hub manager', 'local office manager']),
    authorizeParcelAccess, // Middleware to authorize parcel access
    avoidConflict,         // Middleware to avoid conflicts
    updateParcel           // Controller to update the parcel
);

// Update Parcel Status by ID [mbm, rhm, lom, dp]
router.put(
    '/update-status/:id',
    verifyToken(['main branch manager', 'regional hub manager', 'local office manager', 'Delivery Personnel']),
    authorizeParcelAccess, // Middleware to authorize parcel access
    updateParcelStatus
);

// Delete Parcel by ID [mbm, rhm, lom]
router.delete(
    '/delete/:id',
    verifyToken(['main branch manager', 'regional hub manager', 'local office manager']),
    authorizeParcelAccess, // Middleware to authorize parcel access
    deleteParcel
);

// Track Parcel by ID [admin, mbm, rhm, lom, c]
router.get(
    '/track/:track',
    verifyToken(['admin', 'main branch manager', 'regional hub manager', 'local office manager', 'Customer']),
    trackParcel
);

// Track Parcel by ID [admin, mbm, rhm, lom, c]
router.get(
    '/trackById/:id',
    verifyToken(['Delivery Personnel']),
    // authorizeParcelAccess, // Middleware to authorize parcel access
    trackParcelByid
);

// Parcel Status Report [admin]
router.get('/psr', verifyToken(['admin']), generateParcelStatusReport);

export default router;
