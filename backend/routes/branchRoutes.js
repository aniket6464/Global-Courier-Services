import express from 'express';
import mainBranchSubRoutes from './branch/mainbranchsubRoutes.js';
import regionalHubSubRoutes from './branch/regionalhubsubRoutes.js';
import localOfficeSubRoutes from './branch/localofficesubRoute.js';

const router = express.Router();

// Subroutes for different branch levels
router.use('/main-branch', mainBranchSubRoutes);
router.use('/regional-hub', regionalHubSubRoutes);
router.use('/local-office', localOfficeSubRoutes);

export default router;
