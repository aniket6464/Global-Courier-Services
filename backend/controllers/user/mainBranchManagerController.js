import bcrypt from 'bcryptjs';
import HighPrivilege from '../../models/users/HighPrivilege.js';
import MainBranch from '../../models/branch/MainBranch.js';
import RegionalHub from '../../models/branch/RegionalHub.js';
import LocalOffice from '../../models/branch/LocalOffice.js';

export const createMainBranchManager = async (req, res, next) => {
  try {
    const { name, email, password, branch_id, role = "main branch manager" } = req.body;

    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Check if the branch already has a manager
    const branch = await MainBranch.findById(branch_id);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    if (branch.branch_manager) {
      return res.status(400).json({ message: "Branch already has a manager assigned" });
    }

    // Create new main branch manager object
    const newMainBranchManager = new HighPrivilege({
      name,
      email,
      password: hashedPassword,
      branch_id,
      role,
    });

    // Save the new manager to the HighPrivilege collection
    const savedManager = await newMainBranchManager.save();

    // Assign the manager's ID to the branch's branch_manager field
    branch.branch_manager = savedManager._id;
    await branch.save();

    // Send response
    res.status(201).json({ message: "Main Branch Manager created successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateMainBranchManager = async (req, res, next) => {
  try {
    const id = req.userId;
    const { name, email, password } = req.body;

    // Create an object for fields to update
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) updateFields.password = bcrypt.hashSync(password, 10);

    // Update the main branch manager's details
    const updatedManager = await HighPrivilege.findOneAndUpdate(
      { _id: id, role: 'main branch manager' },
      updateFields,
      { new: true }
    ).select('name email branch_id');

    if (!updatedManager) {
      return res.status(404).json({ message: 'Main branch manager not found' });
    }

    // Fetch branch details using branch_id
    const branchDetails = await MainBranch.findById(updatedManager.branch_id).select('branch_code city state country');

    if (!branchDetails) {
      return res.status(404).json({ message: 'Branch details not found' });
    }

    res.json({
      message: 'Main branch manager updated successfully',
      mainBranchManager: updatedManager,
      branchDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const readMainBranchManager = async (req, res, next) => {
  try {
    const { search, sortField = 'name', sortOrder = 'asc' } = req.query;

    // Define the base filter and add search conditions if provided
    const filter = { role: 'main branch manager' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch main branch managers from the HighPrivilege collection
    const managers = await HighPrivilege.find(filter, 'name email branch_id')
      .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
      .lean();

    // Fetch branch details for each manager
    const managerData = await Promise.all(
      managers.map(async (manager) => {
        const branch = await MainBranch.findById(manager.branch_id, 'branch_code city state country').lean();
        
        return {
          _id:manager._id,
          name: manager.name,
          email: manager.email,
          branch: branch ? {
            branch_id: branch._id,
            branch_code: branch.branch_code,
            city: branch.city,
            state: branch.state,
            country: branch.country
          } : null
        };
      })
    );

    res.status(200).json(managerData);
  } catch (error) {
    next(error);
  }
};

export const changeBranch = async (req, res, next) => {
  try {
    const { id } = req.params; // ID of the current manager
    const { branch_id } = req.body;

    // Check if the branch already has a manager
    const branch = await MainBranch.findById(branch_id);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    if (branch.branch_manager) {
      return res.status(400).json({ message: 'Branch already has a manager assigned' });
    }

    // Update branch to assign the new manager
    branch.branch_manager = id;
    await branch.save();

    // Update the manager's document with the new branch_id
    const updatedManager = await HighPrivilege.findByIdAndUpdate(
      id,
      { branch_id },
      { new: true }
    ).select('name email branch_id');

    res.status(200).json({
      message: 'Branch and manager updated successfully',
      manager: updatedManager,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMainBranchManager = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the main branch manager by ID and verify their role
    const manager = await HighPrivilege.findOne({ _id: id, role: 'main branch manager' });
    if (!manager) {
      return res.status(404).json({ message: 'Main branch manager not found' });
    }

    // Update the MainBranch collection to remove this manager as branch_manager
    await MainBranch.updateOne(
      { branch_manager: id },
      { $unset: { branch_manager: "" } }
    );

    // Delete the manager from the HighPrivilege collection
    await HighPrivilege.findByIdAndDelete(id);

    res.status(200).json({ message: 'Main branch manager deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const mainBranchId = req.branchId;
    
    // Fetch counts of regional hubs and local offices associated with the main branch
    const regionalHubCount = await RegionalHub.countDocuments({ main_branch_id: mainBranchId });
    const localOfficeCount = await LocalOffice.countDocuments({ main_branch_id: mainBranchId });

    // Fetch performance data and parcel information for the main branch
    const mainBranch = await MainBranch.findById(mainBranchId)
      .select("performance_tracking parcel_ids")
      .populate("performance_tracking");

    if (!mainBranch) {
      return res.status(404).json({ error: "Main branch not found" });
    }

    const performanceTracking = mainBranch.performance_tracking;
    const totalDeliveredParcels = performanceTracking.total_delivered_parcels || 0;
    const totalPickupParcels = performanceTracking.total_pickup_parcels || 0;
    const averageDeliveryTime = performanceTracking.average_delivery_time || 0;
    const averageCustomerRating = performanceTracking.average_customer_rating || 0;

    // Count parcels and calculate parcels in progress
    const totalParcels = mainBranch.parcel_ids.length;
    const parcelsInProgress = totalParcels - (totalDeliveredParcels + totalPickupParcels);

    // Prepare dashboard data
    const dashboardData = {
      regionalHubCount,
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

export const getMainBranchManagerDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch the manager from the HighPrivilege collection
    const manager = await HighPrivilege.findOne(
      { _id: id, role: 'main branch manager' }
    ).lean();

    if (!manager) {
      return res.status(404).json({ message: 'Main branch manager not found' });
    }

    const { password: pass, ...managerData } = manager;

    res.status(200).json(managerData);
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res, next) => {
  try {
    const id = req.userId;

    // Update the main branch manager's details
    const Manager = await HighPrivilege.findById(id).select('name email branch_id');

    if (!Manager) {
      return res.status(404).json({ message: 'Main branch manager not found' });
    }

    // Fetch branch details using branch_id
    const branchDetails = await MainBranch.findById(Manager.branch_id).select('branch_code city state country');

    if (!branchDetails) {
      return res.status(404).json({ message: 'Branch details not found' });
    }

    res.json({
      message: 'Main branch manager details',
      mainBranchManager: Manager,
      branchDetails,
    });
  } catch (error) {
    next(error);
  }
};