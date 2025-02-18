import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import MainBranch from '../models/branch/MainBranch.js'
import RegionalHub from '../models/branch/RegionalHub.js'
import LocalOffice from '../models/branch/LocalOffice.js'
import Customer from '../models/users/Customer.js'
import DeliveryPersonnel from '../models/users/DeliveryPersonnel.js';

// Middleware to verify JWT token and role
export const verifyToken = (roles) => (req, res, next) => {
    // Retrieve the token from cookies
    const token = req.cookies.access_token;
    if (!token) return next(errorHandler(401, 'Unauthorized'));

    // Verify the token using the JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(errorHandler(403, 'Forbidden'));

        // Extract user details from decoded token
        const { id, role, branch_id, overseeing_branches, branch_type, main_branch_id, regional_hub_id, local_office_id } = decoded;
        req.userId = id;
        req.userRole = role;

        // Check if the user's role is included in the allowed roles
        if (!roles.includes(req.userRole)) {
            return next(errorHandler(403, 'Access Denied.'));
        }

        // Pass branch information based on the user role
        if (req.userRole === 'main branch manager') {
            req.branchId = branch_id; // For Main Branch Manager, pass the branch_id
        } else if (req.userRole === 'operations head') {
            req.overseeingBranches = overseeing_branches; // For Operations Head, pass the array of overseeing branches
        } else if (req.userRole === 'regional hub manager') {
            req.mainBranchId = main_branch_id; // For Regional Hub Manager, pass the main_branch_id
            req.regionalHubId = regional_hub_id; // and regional_hub_id
        } else if (req.userRole === 'local office manager') {
            req.mainBranchId = main_branch_id; // For Local Office Manager, pass the main_branch_id
            req.regionalHubId = regional_hub_id; // regional_hub_id
            req.localOfficeId = local_office_id; // and local_office_id
        } else if (req.userRole === 'Delivery Personnel') {
            req.branchId = branch_id; // For Delivery Personnel, pass branch_id
            req.branchType = branch_type; // and branch_type
        }

        // Proceed to the next middleware or route handler
        next();
    });

};

export const getParcelIdsMiddleware = async (req, res, next) => {
    try {
      const role = req.userRole;
      let parcelIds = [];

      switch (role) {
        case 'admin':
          // Admin can access all parcels, so no filtering needed here
          return next();
  
        case 'main branch manager':
          const mainBranch = await MainBranch.findOne({ branch_manager: req.userId });
          if (mainBranch) {
            parcelIds = mainBranch.parcel_ids;
          }
          break;
  
        case 'regional hub manager':
          const regionalHub = await RegionalHub.findOne({ regional_hub_manager: req.userId });
          if (regionalHub) {
            parcelIds = regionalHub.parcel_ids;
          }
          break;
  
        case 'local office manager':
          const localOffice = await LocalOffice.findOne({ local_office_manager: req.userId });
          if (localOffice) {
            parcelIds = localOffice.parcel_ids;
          }
          break;
  
        case 'Customer':
          const customer = await Customer.findOne({ _id: req.userId });
          if (customer && customer.order_history) {
            parcelIds = customer.order_history
              .filter(order => order.status === 'Pending')
              .map(order => order.parcel_id);
          }
          break;
  
        default:
          return res.status(403).json({ message: 'Unauthorized access' });
      }
  
      req.parcelIds = parcelIds;
      next();
    } catch (error) {
      next(error)
    }
};

export const authorizeParcelAccess = async (req, res, next) => {
    try {
      const { id } = req.params; 
      const role = req.userRole;
  
      let hasAccess = false;
  
      switch (role) {
        case 'main branch manager':
          const mainBranch = await MainBranch.findOne({ _id: req.branchId });
          if (mainBranch && mainBranch.parcel_ids.includes(id)) {
            hasAccess = true;
          }
          break;
  
        case 'regional hub manager':
          const regionalHub = await RegionalHub.findOne({ _id: req.regionalHubId });
          
          if (regionalHub && regionalHub.parcel_ids.includes(id)) {
            hasAccess = true;
          }
          break;
  
        case 'local office manager':
          const localOffice = await LocalOffice.findOne({ _id: req.localOfficeId });
          if (localOffice && localOffice.parcel_ids.includes(id)) {
            hasAccess = true;
          }
          break;
  
        case 'Customer':
          const customer = await Customer.findOne({ _id: req.userId });
          if (customer && customer.order_history.some(order => order.parcel_id.toString() === id)) {
            hasAccess = true;
          }
          break;
  
        case 'Delivery Personnel':
          const deliveryPersonnel = await DeliveryPersonnel.findOne({ _id: req.userId });
          if (deliveryPersonnel && deliveryPersonnel.parcels.some(parcel => parcel.parcel_id.toString() === id)) {
            hasAccess = true;
          }
          break;
  
        case 'admin':
          hasAccess = true; // Admins have access to all parcels
          break;
  
        default:
          return res.status(403).json({ message: 'Unauthorized access' });
      }
  
      if (!hasAccess) {
        return res.status(403).json({ message: 'Access denied for this parcel' });
      }
  
      next();
    } catch (error) {
      next(error);
    }
};
  