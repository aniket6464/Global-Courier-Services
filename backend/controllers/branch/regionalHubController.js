import RegionalHub from '../../models/branch/RegionalHub.js';
import LocalOffice from '../../models/branch/LocalOffice.js';
import RegionalHubManager from '../../models/users/RegionalHubManager.js';
import crypto from 'crypto';

const generateBranchCode = () => {
  return `BR-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
};

// Create a new branch
export const createRegionalHub = async (req, res, next) => {
  try {
    // Generate a unique branch code
    const branchCode = generateBranchCode();

    // Add the branch code to the request body
    const branchDataWithCode = { ...req.body, branch_code: branchCode };

    // Create the branch with the branch code
    await RegionalHub.create(branchDataWithCode);

    // Respond with a simple message
    return res.status(201).json({ message: 'Branch created' });
  } catch (error) {
    next(error);
  }
};

export const readRegionalHub = async (req, res, next) => {
  try {
      // Destructure query parameters for search, sort, pagination, and filtering
      const { search, main_branch_id, sort, limit = 10, page = 1 } = req.query;

      // Initialize the filter object
      const filter = {};

      // If search parameter is provided, build the search query
      if (search) {
          const query = {
              $or: [
                  { branch_code: { $regex: search, $options: 'i' } },
                  { street: { $regex: search, $options: 'i' } },
                  { city: { $regex: search, $options: 'i' } },
                  { state: { $regex: search, $options: 'i' } },
                  { zip_code: isNaN(search) ? undefined : parseInt(search) },
                  { country: { $regex: search, $options: 'i' } },
                  { regional_coverage: { $regex: search, $options: 'i' } },
                  { phone: isNaN(search) ? undefined : parseInt(search) },
                  { email: { $regex: search, $options: 'i' } },
              ]
          };
          // Merge the search query into the filter
          Object.assign(filter, query);
      }

      // Add main branch ID filter if provided
      if (main_branch_id) {
        filter.main_branch_id = main_branch_id;
      }

      // Set up sort option
      const sortOption = sort ? { [sort]: 1 } : {};

      // Fetch total count of documents matching the filter
      const totalCount = await RegionalHub.countDocuments(filter);

      // Fetch data with filters, sorting, and pagination
      const branches = await RegionalHub.find(filter)
          .select('-promised_delivery_time -parcel_ids -complaint_ids -performance_tracking')
          .sort(sortOption)
          .limit(parseInt(limit))
          .skip((parseInt(page) - 1) * parseInt(limit));

      res.json({
          totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit)), // Calculate total pages
          currentPage: parseInt(page),
          branches
      });
  } catch (error) {
      next(error);
  }
};

export const readRegionalHubById = async (req, res, next) => {
  try {
      const { id } = req.params;

      // Fetch data with filters, sorting, and pagination
      const branch = await RegionalHub.findById(id)
          .select(' -parcel_ids -complaint_ids -performance_tracking')

      res.json(branch);
  } catch (error) {
      next(error);
  }
};

// export const listRegionalHub = async (req, res, next) => {
//   try {
//       // Ensure that req.branchId is available from the JWT payload
//       const branchId = req.branchId;
//       if (!branchId) {
//           return res.status(403).json({ message: 'Access denied: branch ID is missing.' });
//       }

//       // Fetch regional hubs where main_branch_id matches req.branchId
//       const regionalHubs = await RegionalHub.find({ main_branch_id: branchId }, '-promised_delivery_time -parcel_ids -complaint_ids -performance_tracking');

//       // Return the list of regional hubs
//       res.json(regionalHubs);
//   } catch (err) {
//       next(err);
//   }
// };

export const listRegionalHub = async (req, res, next) => {
  try {
    const { branchId, userRole } = req;

    // Determine filter based on user role
    const filter = userRole === 'admin' ? {} : { main_branch_id: branchId };

    if (userRole !== 'admin' && !branchId) {
      return res.status(403).json({ message: 'Access denied: branch ID is missing.' });
    }

    // Fetch regional hubs with the appropriate filter
    const regionalHubs = await RegionalHub.find(filter, '-promised_delivery_time -parcel_ids -complaint_ids -performance_tracking');

    // Return the list of regional hubs
    res.json(regionalHubs);
  } catch (err) {
    next(err);
  }
};

export const listAllRegionalHub = async (req, res, next) => {
  try {
      const filter = req.userRole === 'operations head' 
          ? { main_branch_id: { $in: req.overseeingBranches } } 
          : {};

      // Fetch regional hubs with the specified filter, excluding unwanted fields
      const regionalHubs = await RegionalHub.find(filter, '-main_branch_id -regional_hub_manager -regional_coverage -email -phone -promised_delivery_time -parcel_ids -branch_manager -complaint_ids -performance_tracking');

      // Return the list of regional hubs
      res.json(regionalHubs);
  } catch (err) {
      next(err);
  }
};

export const updateRegionalHub = async (req, res, next) => {
  try {
      const { id } = req.params; // Get the regional hub ID from the request parameters
      const updateData = req.body; // Get the update data from the request body

      // Update the regional hub using findByIdAndUpdate
      const updatedHub = await RegionalHub.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true, projection: '-promised_delivery_time -parcel_ids -complaint_ids -performance_tracking' }
      );

      // If the regional hub is not found, return a 404 status
      if (!updatedHub) {
        return res.status(404).json({ message: 'Regional hub not found' });
      }

      // Respond with the updated regional hub data
      res.json(updatedHub);
  } catch (err) {
      next(err); // Pass the error to the next middleware
  }
};

export const deleteRegionalHub = async (req, res, next) => {
  try {
      const { id } = req.params;

      // Check for active local offices associated with the regional hub
      const activeLocalOffice = await LocalOffice.findOne({ regional_hub_id: id });

      if (activeLocalOffice) {
        return res.status(400).json({ message: 'Cannot delete regional hub: active local office exists.' });
      }

      const deletedHub = await RegionalHub.findByIdAndDelete(id);

      if (!deletedHub) {
          return res.status(404).json({ message: 'Regional hub not found' });
      }

      if(deletedHub.regional_hub_manager){
        const manager = await RegionalHubManager.findById(deletedHub.regional_hub_manager);
        manager.regional_hub_id = undefined;
        manager.main_branch_id = undefined;
        await manager.save()
      }

      res.json({ message: 'Regional hub deleted successfully' });
  } catch (err) {
      next(err);
  }
};

export const changeRegionalHubManager = async (req, res, next) => {
  try {
      const { id } = req.params;
      const { managerId } = req.body;

      // Find the regional hub to get the main_branch_id
      const regionalHub = await RegionalHub.findById(id);
      if (!regionalHub) {
        return res.status(404).json({ message: 'Regional hub not found' });
      }

      // Check if req.branchId matches the regional hub's main_branch_id
      if (req.userRole !=='admin' && req.branchId !== String(regionalHub.main_branch_id)) {
        return res.status(403).json({ message: 'Access denied: You do not have permission to change the manager for this regional hub' });
      }

      // Check if the manager exists in the RegionalHubManager collection and has the correct role
      const manager = await RegionalHubManager.findOne({ _id: managerId });
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }

      // Check if the manager is already assigned to a regional hub
      if (manager.regional_hub_id) {
          return res.status(400).json({ message: 'Cannot assign/change manager: Manager is already assigned to another regional hub' });
      }

      // Update the regional hub with the new manager
      const updatedHub = await RegionalHub.findByIdAndUpdate(id, { regional_hub_manager: managerId }, { new: true, runValidators: true });
      if (!updatedHub) {
          return res.status(404).json({ message: 'Regional hub not found' });
      }

      // Update the RegionalHubManager collection with the branch ID for the manager
      await RegionalHubManager.findByIdAndUpdate(managerId, {
          main_branch_id: updatedHub.main_branch_id,
          regional_hub_id: id
      });

      res.json({ message: 'Manager assigned/changed successfully' });
  } catch (err) {
      next(err);
  }
};

export const getRegionalHubPerformance = async (req, res, next) => {
  try {
      const { sort, limit, page } = req.query;
      const pageNumber = Math.max(parseInt(page, 10) || 1, 1); // Ensure page is at least 1
      const limitNumber = Math.max(Number(limit) || 10, 1);   // Ensure limit is at least 1

      // Build the filter for main_branch_id based on req.branchId or req.overseeingBranches
      let branchFilter = {};
      if (req.branchId) {
          branchFilter = { main_branch_id: req.branchId };
      } else if (req.overseeingBranches?.length) {
          branchFilter = { main_branch_id: { $in: req.overseeingBranches } };
      }

      // Define sorting options based on query
      const sortOptions = {};
      if (sort) {
          const sortFields = sort.split(',');
          sortFields.forEach(field => {
              const isDescending = field.startsWith('-');
              const cleanField = field.replace(/^-/, ''); // Remove '-' for descending fields

              // Check if field is root-level or nested in performance_tracking
              if (RegionalHub.schema.paths[cleanField]) {
                  // Root-level field like 'branch_code'
                  sortOptions[cleanField] = isDescending ? -1 : 1;
              } else if (RegionalHub.schema.paths['performance_tracking']?.schema.paths[cleanField]) {
                  // Nested field inside performance_tracking
                  sortOptions[`performance_tracking.${cleanField}`] = isDescending ? -1 : 1;
              }
          });
      }

      // Fetch regional hubs with only branch_code and performance_tracking fields
      const hubs = await RegionalHub.find(branchFilter, 'branch_code performance_tracking')
          .sort(sortOptions)
          .skip((pageNumber - 1) * limitNumber)
          .limit(limitNumber);

      const totalCount = await RegionalHub.countDocuments(branchFilter);

      res.json({
          totalCount,
          totalPages: Math.ceil(totalCount / limitNumber),
          currentPage: pageNumber,
          hubs,
      });
  } catch (err) {
      next(err);
  }
};

export const getPerformanceById = async (req, res, next) => {
  try {    
    // Check access for reginal hub manager
    if (!req.regionalHubId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Find the branch by ID and select only branch_code and performance_tracking
    const branch = await RegionalHub.findById(req.regionalHubId, 'branch_code performance_tracking');

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.json(branch);
  } catch (err) {
    next(err);
  }
};