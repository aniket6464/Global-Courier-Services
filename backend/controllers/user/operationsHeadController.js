import bcrypt from 'bcryptjs';
import HighPrivilege from '../../models/users/HighPrivilege.js'; 
import MainBranchPerformanceLog from '../../models/performance logs/MainBranchPerformanceLog.js'
import RegionalHubPerformanceLog from '../../models/performance logs/RegionalHubPerformanceLog.js'
import LocalOfficePerformanceLog from '../../models/performance logs/LocalOfficePerformanceLog.js'
import MainBranch from '../../models/branch/MainBranch.js';
import RegionalHub from '../../models/branch/RegionalHub.js';
import LocalOffice from '../../models/branch/LocalOffice.js';

export const createOperationsHead = async (req, res, next) => {
  try {
    const { name, email, password, overseeing_branches, role='operations head' } = req.body;

    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new operations head object
    const newOperationsHead = new HighPrivilege({
      name,
      email,
      password: hashedPassword,
      overseeing_branches,
      role,
    });

    // Save to the HighPrivilege collection
    await newOperationsHead.save();

    // Send response
    res.status(201).json({ message: 'Operations Head created successfully' });
  } catch (error) {
    next(error)
  }
};

export const ParcelTransferEfficiency = async (req, res, next) => {
  const { branch_type, branch_id, start_date, end_date } = req.body;
  
  try {
      let query;
      const dateRange = { $gte: new Date(start_date), $lte: new Date(end_date) };
      
      if (branch_type === 'main') {
          if (!req.overseeingBranches.includes(branch_id)) {
              return res.status(403).json({ error: 'Unauthorized access to branch data' });
          }
          query = MainBranchPerformanceLog.findOne({ branch_id, "performance_measure.date": dateRange });
      } else if (branch_type === 'regional') {
          const regionalHub = await RegionalHub.findById(branch_id);
          
          if (!regionalHub || !req.overseeingBranches.includes(regionalHub.main_branch_id.toString())) {
              return res.status(403).json({ error: 'Unauthorized access to regional hub data' });
          }
          query = RegionalHubPerformanceLog.findOne({ branch_id, "performance_measure.date": dateRange });
      } else {
          return res.status(400).json({ error: 'Invalid branch type' });
      }

      const log = await query.select("performance_measure.average_processing_time performance_measure.date");
      if (!log) return res.status(404).json({ error: 'No performance data found' });
      
      const dateMap = {};

      log.performance_measure.forEach(entry => {
          const date = entry.date.toISOString().split('T')[0]; // Format date to "YYYY-MM-DD"
          if (entry.date >= dateRange.$gte && entry.date <= dateRange.$lte) {
              if (!dateMap[date]) dateMap[date] = { totalTime: 0, count: 0 };
              dateMap[date].totalTime += entry.average_processing_time;
              dateMap[date].count += 1;
          }
      });

      const result = Object.keys(dateMap).map(date => ({
          date,
          avgProcessingTime: dateMap[date].totalTime / dateMap[date].count
      }));

      res.json(result);
  } catch (error) {
      next(error);
  }
};

export const ParcelDeliveryEfficiency = async (req, res, next) => {
  const { branch_type, branch_id, start_date, end_date } = req.body;

  try {
      let query;
      const dateRange = { $gte: new Date(start_date), $lte: new Date(end_date) };

      if (branch_type === 'main') {
          if (!req.overseeingBranches.includes(branch_id)) {
              return res.status(403).json({ error: 'Unauthorized access to branch data' });
          }
          query = MainBranchPerformanceLog.findOne({ branch_id, "performance_measure.date": dateRange });
      } else if (branch_type === 'regional') {
          const regionalHub = await RegionalHub.findById(branch_id);
          if (!regionalHub || !req.overseeingBranches.includes(regionalHub.main_branch_id.toString())) {
              return res.status(403).json({ error: 'Unauthorized access to regional hub data' });
          }
          query = RegionalHubPerformanceLog.findOne({ branch_id, "performance_measure.date": dateRange });
      } else if (branch_type === 'local') {
          const localOffice = await LocalOffice.findById(branch_id);
          if (!localOffice || !req.overseeingBranches.includes(localOffice.main_branch_id.toString())) {
              return res.status(403).json({ error: 'Unauthorized access to localOffice data' });
          }
          query = LocalOfficePerformanceLog.findOne({ branch_id, "performance_measure.date": dateRange });
      } else {
          return res.status(400).json({ error: 'Invalid branch type' });
      }

      const log = await query.select("performance_measure.average_delivery_time performance_measure.total_on_time_delivered_parcel performance_measure.total_delivered_parcel performance_measure.date");
      if (!log) return res.status(404).json({ error: 'No performance data found' });

      const dateMap = {};

      log.performance_measure.forEach(entry => {
          const date = entry.date.toISOString().split('T')[0];
          if (entry.date >= dateRange.$gte && entry.date <= dateRange.$lte) {
              if (!dateMap[date]) {
                  dateMap[date] = {
                      totalDeliveryTime: 0,
                      onTimeDelivered: 0,
                      totalDelivered: 0,
                      count: 0
                  };
              }
              dateMap[date].totalDeliveryTime += entry.average_delivery_time;
              dateMap[date].onTimeDelivered += entry.total_on_time_delivered_parcel;
              dateMap[date].totalDelivered += entry.total_delivered_parcel;
              dateMap[date].count += 1;
          }
      });

      const result = Object.keys(dateMap).map(date => ({
          date,
          avgDeliveryTime: dateMap[date].totalDeliveryTime / dateMap[date].count,
          onTimeDeliveryRate: dateMap[date].totalDelivered
              ? (dateMap[date].onTimeDelivered / dateMap[date].totalDelivered) * 100
              : 0
      }));

      res.json(result);
  } catch (error) {
      next(error);
  }
};

export const ParcelConditionAnalysis = async (req, res, next) => {
  const { branch_type, branch_id, start_date, end_date } = req.body;

  try {
      let query;
      const dateRange = { $gte: new Date(start_date), $lte: new Date(end_date) };

      if (branch_type === 'main') {
          if (!req.overseeingBranches.includes(branch_id)) {
              return res.status(403).json({ error: 'Unauthorized access to branch data' });
          }
          query = MainBranchPerformanceLog.findOne({ branch_id, "performance_measure.date": dateRange });
      } else if (branch_type === 'regional') {
          const regionalHub = await RegionalHub.findById(branch_id);
          if (!regionalHub || !req.overseeingBranches.includes(regionalHub.main_branch_id.toString())) {
              return res.status(403).json({ error: 'Unauthorized access to regional hub data' });
          }
          query = RegionalHubPerformanceLog.findOne({ branch_id, "performance_measure.date": dateRange });
      } else if (branch_type === 'local') {
        const localOffice = await LocalOffice.findById(branch_id);
        if (!localOffice || !req.overseeingBranches.includes(localOffice.main_branch_id.toString())) {
            return res.status(403).json({ error: 'Unauthorized access to localOffice data' });
        }
        query = LocalOfficePerformanceLog.findOne({ branch_id, "performance_measure.date": dateRange });
      } else {
          return res.status(400).json({ error: 'Invalid branch type' });
      }

      const log = await query.select("performance_measure.damaged_in_transit performance_measure.total_parcels performance_measure.lost_in_transit performance_measure.date");
      if (!log) return res.status(404).json({ error: 'No performance data found' });

      const dateMap = {};

      log.performance_measure.forEach(entry => {
          const date = entry.date.toISOString().split('T')[0];
          if (entry.date >= dateRange.$gte && entry.date <= dateRange.$lte) {
              if (!dateMap[date]) {
                  dateMap[date] = {
                      total_parcels: 0,
                      damagedInTransit: 0,
                      lostInTransit: 0
                  };
              }
              dateMap[date].total_parcels += entry.total_parcels;
              dateMap[date].damagedInTransit += entry.damaged_in_transit;
              dateMap[date].lostInTransit += entry.lost_in_transit;
          }
      });

      const result = Object.keys(dateMap).map(date => ({
          date,
          undamagedDeliveryRate: dateMap[date].total_parcels
              ? ((dateMap[date].total_parcels - dateMap[date].damagedInTransit) / dateMap[date].total_parcels) * 100
              : 0,
          lostParcelRate: dateMap[date].total_parcels
              ? (dateMap[date].lostInTransit / dateMap[date].total_parcels) * 100
              : 0
      }));

      res.json(result);
  } catch (error) {
      next(error);
  }
};

export const CustomerSatisfaction = async (req, res, next) => {
  const { branch_type, branch_id, start_date, end_date } = req.body;

  try {
      let query;
      const dateRange = { $gte: new Date(start_date), $lte: new Date(end_date) };

      if (branch_type === 'main') {
          if (!req.overseeingBranches.includes(branch_id)) {
              return res.status(403).json({ error: 'Unauthorized access to branch data' });
          }
          query = MainBranchPerformanceLog.findOne({ branch_id, "performance_measure.date": dateRange });
      } else if (branch_type === 'regional') {
          const regionalHub = await RegionalHub.findById(branch_id);
          if (!regionalHub || !req.overseeingBranches.includes(regionalHub.main_branch_id.toString())) {
              return res.status(403).json({ error: 'Unauthorized access to regional hub data' });
          }
          query = RegionalHubPerformanceLog.findOne({ branch_id, "performance_measure.date": dateRange });
      } else if (branch_type === 'local') {
        const localOffice = await LocalOffice.findById(branch_id);
        if (!localOffice || !req.overseeingBranches.includes(localOffice.main_branch_id.toString())) {
            return res.status(403).json({ error: 'Unauthorized access to localOffice data' });
        }
        query = LocalOfficePerformanceLog.findOne({ branch_id, "performance_measure.date": dateRange });
      } else {
          return res.status(400).json({ error: 'Invalid branch type' });
      }

      const log = await query.select("performance_measure.average_customer_rating performance_measure.total_complaints performance_measure.total_delivered_parcel performance_measure.date");
      if (!log) return res.status(404).json({ error: 'No performance data found' });

      const result = log.performance_measure
          .filter(entry => entry.date >= dateRange.$gte && entry.date <= dateRange.$lte)
          .map(entry => ({
              date: entry.date.toISOString().split('T')[0],
              avgCustomerRating: entry.average_customer_rating,
              customerComplaintRate: entry.total_delivered_parcel
                  ? (entry.total_complaints / entry.total_delivered_parcel) * 100
                  : 0
          }));

      res.json(result);
  } catch (error) {
      next(error);
  }
};

// export const readOperationsHead = async (req, res, next) => {
//     try {
//       const { search, sortField = 'name', sortOrder = 'asc' } = req.query;
  
//       // Define the base filter and add search condition if provided
//       const filter = { role: 'operations head' };
//       if (search) {
//         filter.$or = [
//           { name: { $regex: search, $options: 'i' } },
//           { email: { $regex: search, $options: 'i' } }
//         ];
//       }
  
//       // Fetch operations heads from highprivilege collection
//       const operationsHeads = await HighPrivilege.find(filter, '_id name email overseeing_branches')
//         .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
//         .lean();
  
//       // Fetch branch codes for overseeing branches
//       const operationsHeadData = await Promise.all(
//         operationsHeads.map(async (head) => {
//           const branches = await MainBranch.find(
//             { _id: { $in: head.overseeing_branches } },
//             'branch_code'
//           ).lean();
  
//           // Map overseeing_branches to include branch code
//           const overseeing_branches = branches.map(branch => ({
//             branch_id: branch._id,
//             branch_code: branch.branch_code
//           }));
  
//           return {
//             id: head._id,
//             name: head.name,
//             email: head.email,
//             overseeing_branches
//           };
//         })
//       );
  
//       res.status(200).json(operationsHeadData);
//     } catch (error) {
//       next(error);
//     }
// };  

export const readOperationsHead = async (req, res, next) => {
  try {
    const { search, sortField = 'name', sortOrder = 'asc' } = req.query;

    // Validate sort order and default to 'asc'
    const order = sortOrder.toLowerCase() === 'desc' ? -1 : 1;

    // Define the base filter and add search condition if provided
    const filter = { role: 'operations head' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch operations heads from HighPrivilege collection with sorting
    const operationsHeads = await HighPrivilege.find(filter, '_id name email overseeing_branches')
      .sort({ [sortField]: order })
      .lean();

    // Handle cases where no operations heads are found
    if (!operationsHeads.length) {
      return res.status(404).json({ message: 'No operations heads found.' });
    }

    // Fetch branch codes for overseeing branches
    const operationsHeadData = await Promise.all(
      operationsHeads.map(async (head) => {
        const branches = await MainBranch.find(
          { _id: { $in: head.overseeing_branches } },
          'branch_code'
        ).lean();

        // Map overseeing_branches to include branch code
        const overseeing_branches = branches.map(branch => ({
          branch_id: branch._id,
          branch_code: branch.branch_code
        }));

        return {
          id: head._id,
          name: head.name,
          email: head.email,
          overseeing_branches
        };
      })
    );

    res.status(200).json(operationsHeadData);
  } catch (error) {
    // Log error details for debugging
    console.error('Error fetching operations heads:', error);
    next(error);
  }
};

export const manageBranch = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { branchIds } = req.body; 

        // Find and update the operations head's overseeing_branches array
        const operationsHead = await HighPrivilege.findOneAndUpdate(
        { _id:id, role: 'operations head' },
        { overseeing_branches: branchIds },
        { new: true }
        ).select('name email overseeing_branches');
  
      if (!operationsHead) {
        return res.status(404).json({ message: 'Operations head not found' });
      }
      
      res.json({
        message: 'Overseeing branches updated successfully',
        operationsHead,
      });
    } catch (error) {
      next(error);
    }
};
  
export const updateOperationsHead = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Create an object for fields to update
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) updateFields.password = bcrypt.hashSync(password, 10);

    // Update the operations head's details
    const updatedOperationsHead = await HighPrivilege.findOneAndUpdate(
      { _id: req.userId, role: 'operations head' },
      updateFields,
      { new: true }
    ).select('name email overseeing_branches');

    if (!updatedOperationsHead) {
      return res.status(404).json({ message: 'Operations head not found' });
    }

    // Fetch branch details using overseeing_branches
    const branchDetails = await MainBranch.find({
      _id: { $in: updatedOperationsHead.overseeing_branches },
    }).select('branch_code city state country');

    res.json({
      message: 'Operations head updated successfully',
      operationsHead: updatedOperationsHead,
      branchDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOperationsHead = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Find the operations head by ID and check role
      const operationsHead = await HighPrivilege.findOne({ _id: id, role: 'operations head' });
      
      if (!operationsHead) {
        return res.status(404).json({ message: 'Operations head not found' });
      }
  
      // Delete the operations head
      await HighPrivilege.findByIdAndDelete(id);
  
      res.status(200).json({ message: 'Operations head deleted successfully' });
    } catch (error) {
      next(error);
    }
};
  
export const getDashboard = async (req, res, next) => {
  try {
    const overseeingBranches = req.overseeingBranches;

    const branch = await MainBranch.findOne({ _id: { $in: overseeingBranches } })
    .select("performance_tracking")
    .populate("performance_tracking")
    .sort({ _id: 1 }); // Sort by _id to get the first branch

    if (!branch) {
      return res.status(404).json({ error: "No branch found" });
    }

    const tracking = branch.performance_tracking || {};
    const totalParcels = tracking.total_parcels || 0;
    const totalDeliveredParcels = tracking.total_delivered_parcels || 0;
    const totalOnTimeDeliveredParcels = tracking.total_on_time_delivered_parcels || 0;
    const deliveryAttempted = tracking.delivery_attempted || 0;
    const damagedInTransit = tracking.damaged_in_transit || 0;
    const lostInTransit = tracking.lost_in_transit || 0;
    const totalComplaints = tracking.total_complaints || 0;

    // Calculations for dashboard metrics
    const averageProcessingTime = tracking.average_processing_time || 0;
    const averageDeliveryTime = tracking.average_delivery_time || 0;
    const onTimeDeliveryRate = totalOnTimeDeliveredParcels ? (totalOnTimeDeliveredParcels / totalDeliveredParcels) * 100 : 100;
    const averageCustomerRating = tracking.average_customer_rating || 0;
    const complaintRate = totalDeliveredParcels ? (totalComplaints / totalDeliveredParcels) * 100 : 0;
    const undamagedDeliveryRate = totalParcels ? ((totalParcels - damagedInTransit) / totalParcels) * 100 : 0;

    const dashboardData = {
      branchId: branch._id,
      averageProcessingTime,
      averageDeliveryTime,
      accuracyOfDelivery,
      averageCustomerRating,
      complaintRate,
      undamagedDeliveryRate,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res, next) => {
  try {
    // Update the operations head's details
    const OperationsHead = await HighPrivilege.findById(req.userId).select('name email overseeing_branches');

    if (!OperationsHead) {
      return res.status(404).json({ message: 'Operations head not found' });
    }

    // Fetch branch details using overseeing_branches
    const branchDetails = await MainBranch.find({
      _id: { $in: OperationsHead.overseeing_branches },
    }).select('branch_code city state country');

    res.json({
      message: 'Operations head details',
      operationsHead: OperationsHead,
      branchDetails,
    });
  } catch (error) {
    next(error);
  }
};
