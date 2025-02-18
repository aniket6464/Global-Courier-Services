import LocalOffice from '../../models/branch/LocalOffice.js';
import RegionalHub from '../../models/branch/RegionalHub.js';
import LocalOfficeManager from '../../models/users/LocalOfficeManager.js';
import crypto from 'crypto';

const generateBranchCode = () => {
  return `BR-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
};

// Create a new local office branch
export const createLocalOffice = async (req, res, next) => {
  try {
    // Generate a unique branch code
    const branchCode = generateBranchCode();

    // Fetch the main_branch_id from the RegionalHub collection using document ID
    const regionalHub = await RegionalHub.findById(req.body.regional_hub_id);

    if (!regionalHub) {
      return res.status(404).json({ message: 'Regional hub not found' });
    }

    // Add the branch code to the request body
    const branchDataWithCode = {
      ...req.body,
      main_branch_id:regionalHub.main_branch_id,
      branch_code: branchCode,
    };

    // Create the branch with the branch code and main_branch_id
    await LocalOffice.create(branchDataWithCode);

    // Respond with a simple message
    return res.status(201).json({ message: 'Branch created' });
  } catch (error) {
    next(error);
  }
};

export const readLocalOffice = async (req, res, next) => {
  try {
      // Destructure query parameters for search, sort, pagination, and filtering
      const { search, main_branch_id, regional_hub_id, sort, limit = 10, page = 1 } = req.query;

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

      // Add regional hub ID filter if provided
      if (regional_hub_id) {
          filter.regional_hub_id = regional_hub_id;
      }

      // Set up sort option
      const sortOption = sort ? { [sort]: 1 } : {};

      // Fetch total count of documents matching the filter
      const totalCount = await LocalOffice.countDocuments(filter);

      // Fetch data with filters, sorting, and pagination
      const branches = await LocalOffice.find(filter)
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

export const readLocalOfficeById = async (req, res, next) => {
  try {
      const { id } = req.params;

      // Fetch data with filters, sorting, and pagination
      const branch = await LocalOffice.findById(id)
          .select('-parcel_ids -complaint_ids -performance_tracking')

      res.json(branch);
  } catch (error) {
      next(error);
  }
};

export const listLocalOffice = async (req, res, next) => {
  try {
      // Initialize the filter object
      const filter = {};

      // Apply filtering based on the user's role
      if (req.userRole === 'main branch manager' && req.branchId) {
          filter.main_branch_id = req.branchId;
      } else if (req.userRole === 'regional hub manager' && req.regionalHubId) {
          filter.regional_hub_id = req.regionalHubId;
      }

      // Fetch local offices based on the filter
      const localOffices = await LocalOffice.find(filter)
          .select('-promised_delivery_time -parcel_ids -complaint_ids -performance_tracking');

      // Return the list of local offices
      res.json(localOffices);
  } catch (err) {
      next(err);
  }
};

export const updateLocalOffice = async (req, res, next) => {
  try {
      const { id } = req.params;
      const updateData = req.body;

      // Update the local office with provided data, excluding specific fields
      const updatedOffice = await LocalOffice.findByIdAndUpdate(
          id, 
          updateData, 
          { new: true, runValidators: true, projection: '-promised_delivery_time -parcel_ids -complaint_ids -performance_tracking' }
      );

      if (!updatedOffice) {
          return res.status(404).json({ message: 'Local Office not found' });
      }

      res.json(updatedOffice);
  } catch (err) {
      next(err);
  }
};

export const deleteLocalOffice = async (req, res, next) => {
  try {
      const { id } = req.params;

      const deletedOffice = await LocalOffice.findByIdAndDelete(id);

      if (!deletedOffice) {
          return res.status(404).json({ message: 'Local Office not found' });
      }

      if(deletedOffice.local_office_manager){
        const manager = await LocalOfficeManager.findById(deletedOffice.local_office_manager);
        manager.regional_hub_id = undefined;
        manager.main_branch_id = undefined;
        manager.local_office_id = undefined;
        await manager.save()
      }

      res.json({ message: 'Local Office deleted successfully' });
  } catch (err) {
      next(err);
  }
};

export const changeLocalOfficeManager = async (req, res, next) => {
  try {
      const { id } = req.params;
      const { managerId } = req.body;

      // Find the local office to get the main_branch_id and regional_hub_id
      const localOffice = await LocalOffice.findById(id);
      if (!localOffice) {
          return res.status(404).json({ message: 'Local office not found' });
      }

      // Check access permissions based on main_branch_id and regional_hub_id
      if (req.userRole !=='admin' &&  req.branchId !== String(localOffice.main_branch_id)) {
          return res.status(403).json({ message: 'Access denied: You do not have permission to change the manager for this local office' });
      }
      if (req.regionalHubId && req.regionalHubId !== String(localOffice.regional_hub_id)) {
          return res.status(403).json({ message: 'Access denied: You do not have permission to change the manager for this local office' });
      }

      // Check if the manager exists in the LocalOfficeManager collection
      const manager = await LocalOfficeManager.findById(managerId);
      if (!manager) {
          return res.status(404).json({ message: 'Manager not found' });
      }

      // Check if the manager is already assigned to a local office
      if (manager.local_office_id) {
          return res.status(400).json({ message: 'Cannot assign/change manager: Manager is already assigned to another local office' });
      }

      // Update the local office with the new manager
      const updatedOffice = await LocalOffice.findByIdAndUpdate(
          id, 
          { local_office_manager: managerId }, 
          { new: true, runValidators: true }
      );
      if (!updatedOffice) {
          return res.status(404).json({ message: 'Local office not found' });
      }

      // Update the LocalOfficeManager collection with the main, regional, and local office IDs
      await LocalOfficeManager.findByIdAndUpdate(managerId, {
          main_branch_id: updatedOffice.main_branch_id,
          regional_hub_id: updatedOffice.regional_hub_id,
          local_office_id: id
      });

      res.json({ message: 'Manager assigned/changed successfully' });
  } catch (err) {
      next(err);
  }
};
  
export const getLocalOfficePerformance = async (req, res, next) => {
    try {
        const { sort, limit, page } = req.query;
        const pageNumber = Math.max(parseInt(page, 10) || 1, 1); // Ensure page is at least 1
        const limitNumber = Math.max(Number(limit) || 10, 1);   // Ensure limit is at least 1
  
        // Build the filter for main_branch_id and regional_hub_id based on req.branchId, req.overseeingBranches, and req.regionalHubId
        let branchFilter = {};
        if (req.branchId) {
            branchFilter = { main_branch_id: req.branchId };
        } else if (req.overseeingBranches?.length) {
            branchFilter = { main_branch_id: { $in: req.overseeingBranches } };
        }
        if (req.regionalHubId) {
            branchFilter.regional_hub_id = req.regionalHubId;
        }
  
        // Define sorting options based on query
        const sortOptions = {};
        if (sort) {
            const sortFields = sort.split(',');
            sortFields.forEach(field => {
                const isDescending = field.startsWith('-');
                const cleanField = field.replace(/^-/, ''); // Remove '-' for descending fields
  
                // Check if field is root-level or nested in performance_tracking
                if (LocalOffice.schema.paths[cleanField]) {
                    // Root-level field like 'branch_code'
                    sortOptions[cleanField] = isDescending ? -1 : 1;
                } else if (LocalOffice.schema.paths['performance_tracking']?.schema.paths[cleanField]) {
                    // Nested field inside performance_tracking
                    sortOptions[`performance_tracking.${cleanField}`] = isDescending ? -1 : 1;
                }
            });
        }
  
        // Fetch local offices with only office_code and performance_tracking fields
        const offices = await LocalOffice.find(branchFilter, 'branch_code performance_tracking')
            .sort(sortOptions)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);
  
        const totalCount = await LocalOffice.countDocuments(branchFilter);
  
        res.json({
            totalCount,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
            offices,
        });
    } catch (err) {
        next(err);
    }
};

export const getLocalOfficePerformanceById = async (req, res, next) => {
try {      
    // Check access for local office manager
    if (!req.localOfficeId) {
    return res.status(403).json({ message: 'Access denied' });
    }

    // Find the local office by ID and select only office_code and performance_tracking
    const office = await LocalOffice.findById(req.localOfficeId, 'branch_code performance_tracking');

    if (!office) {
    return res.status(404).json({ message: 'Office not found' });
    }

    res.json(office);
} catch (err) {
    next(err);
}
};

export const listAllLocalOffice = async (req, res, next) => {
    try {
        const filter = req.userRole === 'operations head' 
          ? { main_branch_id: { $in: req.overseeingBranches } } 
          : {};

        // Fetch regional hubs where main_branch_id matches req.branchId
        const LocalOffices = await LocalOffice.find(filter, '-regional_hub_id -local_office_manager -main_branch_id -regional_hub_manager -regional_coverage -email -phone -promised_delivery_time -parcel_ids -branch_manager -complaint_ids -performance_tracking');
  
        // Return the list of regional hubs
        res.json(LocalOffices);
    } catch (err) {
        next(err);
    }
};