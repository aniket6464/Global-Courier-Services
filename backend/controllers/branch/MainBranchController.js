import Branch from '../../models/branch/MainBranch.js';
import RegionalHub from '../../models/branch/RegionalHub.js';
import HighPrivilege from '../../models/users/HighPrivilege.js';
import crypto from 'crypto';

const generateBranchCode = () => {
  return `BR-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
};

// Create a new branch
export const createBranch = async (req, res, next) => {
  try {
    // Generate a unique branch code
    const branchCode = generateBranchCode();

    // Add the branch code to the request body
    const branchDataWithCode = { ...req.body, branch_code: branchCode };

    // Create the branch with the branch code
    await Branch.create(branchDataWithCode);

    // Respond with a simple message
    return res.status(201).json({ message: 'Branch created' });
  } catch (error) {
    next(error);
  }
};

export const readBranch = async (req, res, next) => {
  try {
      const { search, sort, limit, page } = req.query;
      let query = {};
      const pageNumber = parseInt(page) || 1; // Default to the first page
      const limitNumber = Number(limit) || 10; // Default limit to 10

      if (search) {
          query = {
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
      }

      const sortOptions = {};
      if (sort) {
          const sortFields = sort.split(',');
          sortFields.forEach(field => {
              sortOptions[field] = 1; // Ascending order
          });
      }

      const branches = await Branch.find(query, '-performance_tracking -parcel_ids -complaint_ids')
          .sort(sortOptions)
          .skip((pageNumber - 1) * limitNumber) // Calculate skip based on current page
          .limit(limitNumber); // Limit results

      const totalCount = await Branch.countDocuments(query); // Get total count for pagination

      res.json({
          totalCount,
          totalPages: Math.ceil(totalCount / limitNumber), // Calculate total pages
          currentPage: pageNumber,
          branches
      });
  } catch (err) {
      next(err);
  }
};
export const readBranchById = async (req, res, next) => {
  try {
      const { id } = req.params;
      const branch = await Branch.findById(id, '-performance_tracking -parcel_ids -complaint_ids')

      res.json(branch);
  } catch (err) {
      next(err);
  }
};

export const updateBranch = async (req, res, next) => {
  try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedBranch = await Branch.findByIdAndUpdate(id, updateData, { new: true, runValidators: true, projection: '-performance_tracking -parcel_ids -complaint_ids' });

      if (!updatedBranch) {
          return res.status(404).json({ message: 'Branch not found' });
      }

      res.json(updatedBranch);
  } catch (err) {
      next(err);
  }
};

export const deleteBranch = async (req, res, next) => {
  try {
      const { id } = req.params;

      // Check for active regional hubs associated with the branch
      const activeRegionalHub = await RegionalHub.findOne({ main_branch_id: id });

      if (activeRegionalHub) {
          return res.status(400).json({ message: 'Cannot delete branch: active regional hub exists.' });
      }

      const deletedBranch = await Branch.findByIdAndDelete(id);

      if (!deletedBranch) {
          return res.status(404).json({ message: 'Branch not found' });
      }

      if(deletedBranch.branch_manager){
        const manager = await HighPrivilege.findById(deletedBranch.branch_manager);
        manager.branch_id = undefined;
        await manager.save()
      }

      res.json({ message: 'Branch deleted successfully' });
  } catch (err) {
      next(err);
  }
};

export const changeManager = async (req, res, next) => {
  try {
      const { id } = req.params;
      const { managerId } = req.body;

      // Check if the manager exists and has the correct role
      const manager = await HighPrivilege.findOne({ _id: managerId, role: 'main branch manager' });

      if (!manager) {
          return res.status(404).json({ message: 'Manager not found' });
      }

      // Check if the manager is already assigned to a branch
      if (manager.branch_id) {
          return res.status(400).json({ message: 'Cannot assign/change manager: Manager is already assigned to a another branch' });
      }

      // Update the branch with the new manager
      const updatedBranch = await Branch.findByIdAndUpdate(id, { branch_manager: managerId }, { new: true, runValidators: true });

      if (!updatedBranch) {
          return res.status(404).json({ message: 'Branch not found' });
      }

      // Update the HighPrivilege collection with the branch ID for the manager
      await HighPrivilege.findByIdAndUpdate(managerId, { branch_id: id });

      res.json({ message: 'Manager assigned/changed successfully' });
  } catch (err) {
      next(err);
  }
};

export const getPerformance = async (req, res, next) => {
    try {
        const { sort, limit, page } = req.query;

        // Default pagination values
        const pageNumber = Math.max(parseInt(page, 10) || 1, 1); // Ensure page is at least 1
        const limitNumber = Math.max(Number(limit) || 10, 1);   // Ensure limit is at least 1

        // Get overseeing branches from JWT payload
        const branchFilter = req.overseeingBranches?.length
            ? { _id: { $in: req.overseeingBranches } }
            : {};

        // Define sorting options
        const sortOptions = {};
        if (sort) {
            const sortFields = sort.split(',');
            sortFields.forEach(field => {
                const isDescending = field.startsWith('-');
                const cleanField = field.replace(/^-/, ''); // Remove '-' for descending fields
                
                // Check if it's a root-level field or nested in performance_tracking
                if (Branch.schema.paths[cleanField]) {
                    // Root-level field like 'branch_code'
                    sortOptions[cleanField] = isDescending ? -1 : 1;
                } else if (Branch.schema.paths['performance_tracking']?.schema?.paths[cleanField]) {
                    // Nested field in 'performance_tracking'
                    sortOptions[`performance_tracking.${cleanField}`] = isDescending ? -1 : 1;
                }
            });
        }

        // Query branches with branch_code and performance_tracking fields
        const branches = await Branch.find(branchFilter, 'branch_code performance_tracking')
            .sort(sortOptions)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .lean(); // Improves query performance by skipping mongoose document instantiation

        // Total count for pagination
        const totalCount = await Branch.countDocuments(branchFilter);

        // Respond with paginated and sorted results
        res.status(200).json({
            totalCount,
            totalPages: Math.ceil(totalCount / limitNumber),
            currentPage: pageNumber,
            branches,
        });
    } catch (err) {
        // Improved error handling
        console.error('Error fetching performance data:', err.message);
        res.status(500).json({ error: 'Failed to fetch performance data. Please try again later.' });
    }
};

export const getPerformanceById = async (req, res, next) => {
    try {
      // Check access for main branch manager
      if (!req.branchId) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      // Find the branch by ID and select only branch_code and performance_tracking
      const branch = await Branch.findById(req.branchId, 'branch_code performance_tracking');
  
      if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
      }
  
      res.json(branch);
    } catch (err) {
      next(err);
    }
};

export const listBranch = async (req, res, next) => {
    try {
        const filter = req.userRole === 'operations head' 
            ? { _id: { $in: req.overseeingBranches } } 
            : {};

        // Fetch branches with the specified filter, excluding unwanted fields
        const branches = await Branch.find(filter, '-regional_coverage -email -phone -promised_delivery_time -parcel_ids -branch_manager -complaint_ids -performance_tracking');

        // Return the list
        res.json(branches);
    } catch (err) {
        next(err);
    }
};
