import bcrypt from 'bcryptjs';
import mongoose from 'mongoose'
import RegionalHubManager from '../../models/users/RegionalHubManager.js';
import RegionalHub from '../../models/branch/RegionalHub.js';
import LocalOffice from '../../models/branch/LocalOffice.js';

export const createRegionalHubManager = async (req, res, next) => {
  try {
    const { name, email, password, regional_hub_id } = req.body;

    // Fetch the regional hub and check if it exists
    const Regional_Hub = await RegionalHub.findById(regional_hub_id).select('main_branch_id regional_hub_manager');
    if (!Regional_Hub) {
      return res.status(404).json({ message: 'Regional Hub not found' });
    }

    // Check if the regional hub already has a manager
    if (Regional_Hub.regional_hub_manager) {
      return res.status(400).json({ message: 'Regional Hub already has a manager assigned.' });
    }

    const { main_branch_id } = Regional_Hub;

    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new regional hub manager object
    const newRegionalHubManager = new RegionalHubManager({
      name,
      email,
      password: hashedPassword,
      regional_hub_id,
      main_branch_id,
    });

    // Save the new manager to the RegionalHubManager collection
    const savedManager = await newRegionalHubManager.save();

    // Assign the manager's ID to the regional hub's regional_hub_manager field
    Regional_Hub.regional_hub_manager = savedManager._id;
    await Regional_Hub.save();

    // Send response
    res.status(201).json({ message: 'Regional Hub Manager created successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateRegionalHubManager = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Create an object for fields to update
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) updateFields.password = bcrypt.hashSync(password, 10);

    // Update the regional hub manager's details based on req.userId
    const updatedManager = await RegionalHubManager.findOneAndUpdate(
      { _id: req.userId },
      updateFields,
      { new: true }
    ).select('name email regional_hub_id');

    if (!updatedManager) {
      return res.status(404).json({ message: 'Regional hub manager not found' });
    }

    // Fetch branch details using regional_hub_id
    const branchDetails = await RegionalHub.findById(updatedManager.regional_hub_id).select('branch_code city state country');

    if (!branchDetails) {
      return res.status(404).json({ message: 'Branch details not found' });
    }

    res.json({
      message: 'Regional hub manager updated successfully',
      regionalHubManager: updatedManager,
      branchDetails
    });
  } catch (error) {
    next(error);
  }
};

// export const readRegionalHubManager = async (req, res, next) => {
//   try {
//     const { userRole, branchId } = req;
//     const { main_branch_id, search, page = 1, limit = 10 } = req.query;

//     const limitNumber = Number(limit) || 10; // Default limit to 10
//     const skip = (page - 1) * limitNumber;

//     const filter = {};
//     if (userRole === 'admin') {
//       if (main_branch_id) {
//         filter.main_branch_id = new mongoose.Types.ObjectId(main_branch_id);
//       }
//     } else if (userRole === 'main branch manager') {
//       filter.main_branch_id = new mongoose.Types.ObjectId(branchId);
//     }

//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const managers = await RegionalHubManager.aggregate([
//       { $match: filter },
//       {
//         $lookup: {
//           from: 'regionalhubs',
//           localField: 'regional_hub_id',
//           foreignField: '_id',
//           as: 'branchDetails'
//         }
//       },
//       { $unwind: '$branchDetails' },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           email: 1,
//           branch: {
//             branch_id: '$branchDetails._id',
//             branch_code: '$branchDetails.branch_code',
//             city: '$branchDetails.city',
//             state: '$branchDetails.state',
//             country: '$branchDetails.country'
//           }
//         }
//       },
//       { $skip: skip },
//       { $limit: limitNumber }
//     ]);

//     const totalCount = await RegionalHubManager.countDocuments(filter);
//     const totalPages = Math.ceil(totalCount / limitNumber);

//     res.status(200).json({
//       totalCount,
//       totalPages,
//       currentPage: page,
//       managers
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const readRegionalHubManager = async (req, res, next) => {
  try {
    const { userRole, branchId } = req;
    const { main_branch_id, search, page = 1, limit = 10 } = req.query;

    const limitNumber = Math.max(Number(limit), 2); // Ensure limit is valid
    const skip = Math.max((Number(page) - 1) * limitNumber, 0); // Ensure skip is non-negative

    const filter = {};

    // Role-based filtering
    if (userRole === 'admin' && main_branch_id) {
      filter.main_branch_id = new mongoose.Types.ObjectId(main_branch_id);
    } else if (userRole === 'main branch manager' && branchId) {
      filter.main_branch_id = new mongoose.Types.ObjectId(branchId);
    }

    // Apply search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Step 1: Use separate query for total count
    const totalCount = await RegionalHubManager.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNumber);

    // Step 2: Paginated query with strict control
    const pipeline = [
      { $match: filter }, // Match filter
      {
        $lookup: {
          from: 'regionalhubs',
          localField: 'regional_hub_id',
          foreignField: '_id',
          as: 'branchDetails'
        }
      },
      { $unwind: { path: '$branchDetails', preserveNullAndEmptyArrays: true } }, // Handle empty arrays safely
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          branch: {
            branch_id: '$branchDetails._id',
            branch_code: '$branchDetails.branch_code',
            city: '$branchDetails.city',
            state: '$branchDetails.state',
            country: '$branchDetails.country'
          }
        }
      },
      { $skip: skip }, // Skip for pagination
      { $limit: limitNumber } // Limit for pagination
    ];

    const managers = await RegionalHubManager.aggregate(pipeline);

    // Step 3: Return paginated response
    res.status(200).json({
      totalCount,
      totalPages,
      currentPage: Number(page),
      managers
    });
  } catch (error) {
    console.error('Error in readRegionalHubManager:', error);
    next(error);
  }
};

export const getRegionalHubManagerDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch the manager from the RegionalHubManager collection
    const manager = await RegionalHubManager.findOne({ _id: id }).lean();

    if (!manager) {
      return res.status(404).json({ message: 'Regional hub manager not found' });
    }

    // Exclude the password field from the response
    const { password: pass, ...managerData } = manager;

    res.status(200).json(managerData);
  } catch (error) {
    next(error);
  }
};

export const changeBranch = async (req, res, next) => {
  try {
    const managerId = req.params.id;
    const { branch_id } = req.body;

    // Convert branch_id to ObjectId for MongoDB queries
    const branchObjectId = new mongoose.Types.ObjectId(branch_id);

    // Check if regional_hub_manager already exists in the specified branch
    const branch = await RegionalHub.findOne({ _id: branchObjectId });
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found.' });
    } 

    if (branch.regional_hub_manager) {
      return res.status(400).json({ message: 'Branch already has a regional hub manager assigned.' });
    }

    // Update the branch to assign the manager as regional_hub_manager
    branch.regional_hub_manager = managerId;
    await branch.save();

    // Update the regional hub manager with the new branch information
    const updatedManager = await RegionalHubManager.findByIdAndUpdate(
      managerId,
      {
        regional_hub_id: branch._id,
        main_branch_id: branch.main_branch_id 
      },
      { new: true }
    );    

    res.status(200).json({
      message: 'Regional hub manager assigned to the branch successfully.',
      manager: updatedManager
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRegionalHubManager = async (req, res, next) => {
  try {
    const managerId = req.params.id;

    // Fetch the manager to get `main_branch_id` and `regional_hub_id`
    const manager = await RegionalHubManager.findById(managerId);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    const { main_branch_id, regional_hub_id } = manager;

    // Check access for main branch manager
    if (req.userRole === 'main branch manager' && req.branchId.toString() !== main_branch_id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Remove `regional_hub_manager` attribute from the hub
    await RegionalHub.findByIdAndUpdate(regional_hub_id, { $unset: { regional_hub_manager: "" } });

    // Delete the manager
    await RegionalHubManager.findByIdAndDelete(managerId);

    res.status(200).json({ message: 'Regional hub manager deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const regionalHubId = req.regionalHubId;

    // Fetch count of local offices associated with the regional hub
    const localOfficeCount = await LocalOffice.countDocuments({ regional_hub_id: regionalHubId });

    // Fetch performance data and parcel information for the regional hub
    const regionalHub = await RegionalHub.findById(regionalHubId)
      .select("performance_tracking parcel_ids")
      .populate("performance_tracking");

    if (!regionalHub) {
      return res.status(404).json({ error: "Regional hub not found" });
    }

    const performanceTracking = regionalHub.performance_tracking;
    const totalDeliveredParcels = performanceTracking.total_delivered_parcels || 0;
    const totalPickupParcels = performanceTracking.total_pickup_parcels || 0;
    const averageDeliveryTime = performanceTracking.average_delivery_time || 0;
    const averageCustomerRating = performanceTracking.average_customer_rating || 0;

    // Count parcels and calculate parcels in progress
    const totalParcels = regionalHub.parcel_ids.length;
    const parcelsInProgress = totalParcels - (totalDeliveredParcels + totalPickupParcels);

    // Prepare dashboard data
    const dashboardData = {
      localOfficeCount,
      totalDeliveredParcels,
      totalPickupParcels,
      averageDeliveryTime,
      averageCustomerRating,
      totalParcels,
      parcelsInProgress
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    next(error)
  }
}

export const profile = async (req, res, next) => {
  try {
    // Update the regional hub manager's details based on req.userId
    const Manager = await RegionalHubManager.findById(req.userId).select('name email regional_hub_id');

    if (!Manager) {
      return res.status(404).json({ message: 'Regional hub manager not found' });
    }

    // Fetch branch details using regional_hub_id
    const branchDetails = await RegionalHub.findById(Manager.regional_hub_id).select('branch_code city state country');

    if (!branchDetails) {
      return res.status(404).json({ message: 'Branch details not found' });
    }

    res.json({
      message: 'Regional hub manager details',
      regionalHubManager: Manager,
      branchDetails
    });
  } catch (error) {
    next(error);
  }
};
