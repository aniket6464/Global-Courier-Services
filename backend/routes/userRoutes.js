import express from 'express';
import adminSubRoutes from './user/adminsubRoutes.js';
import operationsHeadSubRoutes from './user/operationsHeadsubRoutes.js';
import mainBranchManagerSubRoutes from './user/mainBranchManagerSubRoutes.js';
import regionalHubManagerSubRoutes from './user/regionalHubManagersubRoutes.js';
import localOfficeManagerSubRoutes from './user/localOfficeManagersubRoutes.js';
import deliveryPersonnelSubRoutes from './user/deliveryPersonnelsubRoutes.js';
import customerSubRoutes from './user/customerSubRoutes.js';

const router = express.Router();

// Subroutes for different user roles
router.use('/admin', adminSubRoutes);
router.use('/operations-head', operationsHeadSubRoutes);
router.use('/main-branch-manager', mainBranchManagerSubRoutes);
router.use('/regional-hub-manager', regionalHubManagerSubRoutes);
router.use('/local-office-manager', localOfficeManagerSubRoutes);
router.use('/delivery-personnel', deliveryPersonnelSubRoutes);
router.use('/customer', customerSubRoutes);

export default router;
