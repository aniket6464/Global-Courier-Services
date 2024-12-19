import bcrypt from 'bcryptjs';
import mongoose from 'mongoose'
import LocalOffice from '../../models/branch/LocalOffice.js'; 
import LocalOfficeManager from '../../models/users/LocalOfficeManager.js'

export const createLocalOfficeManager = async (req, res, next) => {
  try {
    const { name, email, password, local_office_id } = req.body;

    // Fetch regional_hub_id and main_branch_id from the LocalOffice collection
    const localOffice = await LocalOffice.findById(local_office_id).select('regional_hub_id main_branch_id local_office_manager');
    if (!localOffice) {
      return res.status(404).json({ message: 'Local Office not found' });
    }

    // If local_office_manager exists, prevent reassignment
    if (localOffice.local_office_manager) {
      return res.status(400).json({ message: 'This office already has a manager assigned' });
    }

    const { regional_hub_id, main_branch_id } = localOffice;

    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new local office manager object
    const newLocalOfficeManager = new LocalOfficeManager({
      name,
      email,
      password: hashedPassword,
      local_office_id,
      regional_hub_id,
      main_branch_id,
    });

    // Save the new manager to the LocalOfficeManager collection
    const savedManager = await newLocalOfficeManager.save();

    // Assign the manager's ID to the local office's local_office_manager field
    localOffice.local_office_manager = savedManager._id;
    await localOffice.save();

    // Send response
    res.status(201).json({ message: 'Local Office Manager created successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateLocalOfficeManager = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Create an object for fields to update
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) updateFields.password = bcrypt.hashSync(password, 10);

    // Update the local office manager's details
    const updatedLocalOfficeManager = await LocalOfficeManager.findOneAndUpdate(
      { _id: req.userId },
      updateFields,
      { new: true }
    ).select('name email local_office_id');

    if (!updatedLocalOfficeManager) {
      return res.status(404).json({ message: 'Local office manager not found' });
    }

    // Fetch branch details using regional_hub_id
    const branchDetails = await LocalOffice.findById(updatedLocalOfficeManager.local_office_id).select('branch_code city state country');

    if (!branchDetails) {
      return res.status(404).json({ message: 'Branch details not found' });
    }

    res.json({
      message: 'Local office manager updated successfully',
      localOfficeManager: updatedLocalOfficeManager,
      branchDetails
    });
  } catch (error) {
    next(error);
  }
};

// export const readLocalOfficeManager = async (req, res, next) => {
//   try {
//     const { userRole, branchId, regionalHubId } = req;
//     const { main_branch_id, regional_hub_id, search, page = 1, limit = 10 } = req.query;

//     const filter = {};

//     if (userRole === 'admin') {
//       if (main_branch_id) filter.main_branch_id = new mongoose.Types.ObjectId(main_branch_id);
//       if (regional_hub_id) filter.regional_hub_id = new mongoose.Types.ObjectId(regional_hub_id);
//     } else if (userRole === 'main branch manager') {
//       filter.main_branch_id = new mongoose.Types.ObjectId(branchId);
//       if (regional_hub_id) filter.regional_hub_id = new mongoose.Types.ObjectId(regional_hub_id);
//     } else if (userRole === 'regional hub manager') {
//       filter.regional_hub_id = new mongoose.Types.ObjectId(regionalHubId);
//     }

//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const skip = (page - 1) * limit;

//     const managers = await LocalOfficeManager.find(filter)
//       .skip(skip)
//       .limit(limit)
//       .select('_id name email main_branch_id regional_hub_id');

//     const totalCount = await LocalOfficeManager.countDocuments(filter);
//     const totalPages = Math.ceil(totalCount / limit);

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

export const readLocalOfficeManager = async (req, res, next) => {
  try {
    const { userRole, branchId, regionalHubId } = req;
    const { main_branch_id, regional_hub_id, search, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (userRole === 'admin') {
      if (main_branch_id) filter.main_branch_id = new mongoose.Types.ObjectId(main_branch_id);
      if (regional_hub_id) filter.regional_hub_id = new mongoose.Types.ObjectId(regional_hub_id);
    } else if (userRole === 'main branch manager') {
      filter.main_branch_id = new mongoose.Types.ObjectId(branchId);
      if (regional_hub_id) filter.regional_hub_id = new mongoose.Types.ObjectId(regional_hub_id);
    } else if (userRole === 'regional hub manager') {
      filter.regional_hub_id = new mongoose.Types.ObjectId(regionalHubId);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const managers = await LocalOfficeManager.find(filter)
      .skip(skip)
      .limit(limit)
      .select('_id name email main_branch_id regional_hub_id local_office_id');

    const enrichedManagers = await Promise.all(
      managers.map(async (manager) => {
        if (manager.local_office_id) {
          const localOffice = await LocalOffice.findById(manager.local_office_id)
            .select('_id branch_code city state country');
          return {
            ...manager.toObject(),
            branch: localOffice || null
          };
        }
        return manager;
      })
    );

    const totalCount = await LocalOfficeManager.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      totalCount,
      totalPages,
      currentPage: page,
      managers: enrichedManagers
    });
  } catch (error) {
    next(error);
  }
};

export const getLocalOfficeManagerDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch the manager from the LocalOfficeManager collection
    const manager = await LocalOfficeManager.findOne({ _id: id }).lean();

    if (!manager) {
      return res.status(404).json({ message: 'Local office manager not found' });
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
    const branchId = new mongoose.Types.ObjectId(req.body.branch_id); // Convert branch_id to ObjectId

    // Fetch the local office to check if it already has a manager
    const localOffice = await LocalOffice.findById(branchId);
    if (!localOffice) {
      return res.status(404).json({ message: 'Local office not found' });
    }

    // If local_office_manager exists, prevent reassignment
    if (localOffice.local_office_manager) {
      return res.status(400).json({ message: 'This office already has a manager assigned' });
    }

    // Assign the manager to the local office
    localOffice.local_office_manager = managerId;
    await localOffice.save();

    // Update the manager's main_branch_id, regional_hub_id, and local_office_id
    await LocalOfficeManager.findByIdAndUpdate(managerId, {
      main_branch_id: localOffice.main_branch_id,
      regional_hub_id: localOffice.regional_hub_id,
      local_office_id: localOffice._id
    });

    res.status(200).json({ message: 'Local office manager assigned successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteLocalOfficeManager = async (req, res, next) => {
  try {
    const managerId = req.params.id;

    // Find the local office that is managed by this manager
    const localOffice = await LocalOffice.findOne({ local_office_manager: managerId });
    if (localOffice) {
      // Remove the local_office_manager reference from the local office
      localOffice.local_office_manager = null;
      await localOffice.save();
    }

    // Delete the manager from the LocalOfficeManager collection
    await LocalOfficeManager.findByIdAndDelete(managerId);

    res.status(200).json({ message: 'Local office manager deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const localOfficeId = req.localOfficeId;

    // Fetch performance data and parcel information for the local office
    const localOffice = await LocalOffice.findById(localOfficeId)
      .select("performance_tracking parcel_ids")
      .populate("performance_tracking");

    if (!localOffice) {
      return res.status(404).json({ error: "Local office not found" });
    }

    const performanceTracking = localOffice.performance_tracking;
    const totalDeliveredParcels = performanceTracking.total_delivered_parcels || 0;
    const totalPickupParcels = performanceTracking.total_pickup_parcels || 0;
    const averageDeliveryTime = performanceTracking.average_delivery_time || 0;
    const averageCustomerRating = performanceTracking.average_customer_rating || 0;

    // Count parcels and calculate parcels in progress
    const totalParcels = localOffice.parcel_ids.length;
    const parcelsInProgress = totalParcels - (totalDeliveredParcels + totalPickupParcels);

    // Prepare dashboard data
    const dashboardData = {
      totalDeliveredParcels,
      totalPickupParcels,
      averageDeliveryTime,
      averageCustomerRating,
      totalParcels,
      parcelsInProgress
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
}

export const profile = async (req, res, next) => {
  try {
    // Update the local office manager's details
    const LocalofficeManager = await LocalOfficeManager.findById(req.userId).select('name email local_office_id');

    if (!LocalofficeManager) {
      return res.status(404).json({ message: 'Local office manager not found' });
    }

    // Fetch branch details using regional_hub_id
    const branchDetails = await LocalOffice.findById(LocalofficeManager.local_office_id).select('branch_code city state country');

    if (!branchDetails) {
      return res.status(404).json({ message: 'Branch details not found' });
    }

    res.json({
      message: 'Local office manager details',
      localOfficeManager: LocalofficeManager,
      branchDetails
    });
  } catch (error) {
    next(error);
  }
};