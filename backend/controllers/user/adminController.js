import bcrypt from 'bcryptjs';
import HighPrivilege from '../../models/users/HighPrivilege.js';
import MainBranch from '../../models/branch/MainBranch.js';
import RegionalHub from '../../models/branch/RegionalHub.js';
import LocalOffice from '../../models/branch/LocalOffice.js';
import RegionalHubManager from '../../models/users/RegionalHubManager.js';
import LocalOfficeManager from '../../models/users/LocalOfficeManager.js';
import Customer from '../../models/users/Customer.js';
import Parcel from '../../models/Parcel/Parcel.js';
import DeliveryPersonnel from '../../models/users/DeliveryPersonnel.js';
import Complaint from '../../models/CustomerFeedback/Complaint.js';
import Feedback from '../../models/CustomerFeedback/Feedback.js';
import Review from '../../models/CustomerFeedback/Review.js';
import SystemSettings from '../../models/SystemSettings.js';
import performanceTrackingSchema from '../../models/performance logs/performanceTrackingSchema.js';

export const updateAdmin = async (req, res, next) => {
  try {
    const adminId = req.userId;
    const { name, email, password } = req.body;

    // Create an object for fields to update
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) updateFields.password = bcrypt.hashSync(password, 10);

    // Update the admin's details
    const updatedAdmin = await HighPrivilege.findOneAndUpdate(
      { _id: adminId, role: 'admin' },
      updateFields,
      { new: true }
    ).select('name email');

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      message: 'Admin updated successfully',
      admin: updatedAdmin,
    });
  } catch (error) {
    next(error);
  }
};

export const readReview = async (req, res, next) => {
  try {
    // Fetch all reviews and populate customer details
    const reviews = await Review.find()

    // Format the response
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const readSystemSetting = async (req, res, next) => {
  try {
    // Fetch the system settings and performance tracking data in parallel
    const [settings, performanceTracking] = await Promise.all([
      SystemSettings.findOne(),
      performanceTrackingSchema.findOne(),
    ]);

    if (!settings) {
      return res.status(404).json({ message: "System settings not found" });
    }

    // Append performance tracking data to the settings
    const result = {
      ...settings.toObject(),
      performanceTracking: performanceTracking || {},
    };

    // Send the combined result as a response
    res.status(200).json(result);
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    next(error);
  }
};

export const updateSystemSetting = async (req, res) => {
  try {
    const { generalSettings, branchManagementSettings, parcelSettings } = req.body;

    // Fetch the current system settings document (assuming there's only one document)
    const systemSettings = await SystemSettings.findOne();

    if (!systemSettings) {
      return res.status(404).json({ message: "System settings not found." });
    }

    // Update fields if they are provided in the request
    if (generalSettings) {
      systemSettings.generalSettings = { 
        ...systemSettings.generalSettings.toObject(), 
        ...generalSettings 
      };
    }

    if (branchManagementSettings) {
      systemSettings.branchManagementSettings = { 
        ...systemSettings.branchManagementSettings.toObject(), 
        ...branchManagementSettings 
      };
    }

    if (parcelSettings) {
      systemSettings.parcelSettings = { 
        ...systemSettings.parcelSettings.toObject(), 
        ...parcelSettings 
      };
    }

    // Save the updated settings
    await systemSettings.save();

    res.status(200).json({ message: "System settings updated successfully.", systemSettings });
  } catch (error) {
    res.status(500).json({ message: "Failed to update system settings.", error: error.message });
  }
};

export const readComplaint = async (req, res) => {
  const { userRole, branchId, regionalHubId, localOfficeId, userId } = req;
  const { page = 1, limit = 10 } = req.query;

  try {
    let complaintIds = [];

    if (userRole === 'admin') {
      // Admin role: access to all complaints, no filter by ID
      const complaints = await Complaint.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const totalCount = await Complaint.countDocuments();
      return res.status(200).json({
        success: true,
        complaints,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      });
    }

    if (['main branch manager', 'regional hub manager', 'local office manager'].includes(userRole)) {
      // Manager role: fetch complaint IDs based on branch type and ID
      let branch;
      if (userRole ==='main branch manager') {
        branch = await MainBranch.findById(branchId);
      } else if (userRole ==='regional hub manager') {
        branch = await RegionalHub.findById(regionalHubId);
      } else if (userRole ==='local office manager') {
        branch = await LocalOffice.findById(localOfficeId);
      }
      if (!branch) {
        return res.status(404).json({ success: false, message: 'Branch not found' });
      }

      complaintIds = branch.complaint_ids || [];
    }

    if (userRole === 'Delivery Personnel') {
      // Delivery Personnel: fetch complaint IDs from personnel record
      const personnel = await DeliveryPersonnel.findById(userId);
      if (!personnel) {
        return res.status(404).json({ success: false, message: 'Personnel not found' });
      }
      complaintIds = personnel.complaint_ids || [];
    }

    // Fetch complaints using complaintIds and apply pagination
    const complaints = await Complaint.find({ _id: { $in: complaintIds } })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const totalCount = complaintIds.length;
    return res.status(200).json({
      success: true,
      complaints,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: `Failed to read complaints: ${error.message}` });
  }
};

// export const readFeedback = async (req, res) => {
//   const { page = 1, limit = 10 } = req.query;

//   try {
//     // Fetch feedback entries with pagination
//     const feedbackEntries = await Feedback.find()
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec();

//     // Count total feedback entries
//     const totalCount = await Feedback.countDocuments();

//     return res.status(200).json({
//       success: true,
//       feedback: feedbackEntries,
//       totalPages: Math.ceil(totalCount / limit),
//       totalCount,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: `Failed to read feedback: ${error.message}` });
//   }
// };

export const readFeedback = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    // Build the filter query based on user role
    let filter = {};
    if (req.userRole === 'regional hub manager') {
      filter.feedbackType = { $in: ['Regional Hubs', 'Local Offices'] };
    } else if (req.userRole === 'local office manager') {
      filter.feedbackType = 'Local Offices';
    }

    // Fetch feedback entries with pagination and filtering
    const feedbackEntries = await Feedback.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Count total feedback entries matching the filter
    const totalCount = await Feedback.countDocuments(filter);

    return res.status(200).json({
      success: true,
      feedback: feedbackEntries,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to read feedback: ${error.message}`,
    });
  }
};

export const getDashboard = async (req, res) => {
  try {
    // Fetch counts from various collections
    const mainBranchCount = await MainBranch.countDocuments();
    const regionalHubCount = await RegionalHub.countDocuments();
    const localOfficeCount = await LocalOffice.countDocuments();

    const mainBranchManagerCount = await HighPrivilege.countDocuments({ role: "main branch manager" });
    const operationsHeadCount = await HighPrivilege.countDocuments({ role: "operations head" });
    const regionalHubManagerCount = await RegionalHubManager.countDocuments();
    const localOfficeManagerCount = await LocalOfficeManager.countDocuments();
    const deliveryPersonnelCount = await DeliveryPersonnel.countDocuments();
    const customerCount = await Customer.countDocuments();
    const parcelCount = await Parcel.countDocuments();

    // Fetch performance tracking metrics
    const performanceData = await performanceTrackingSchema.findOne(); 

    const totalDeliveredParcels = performanceData.total_delivered_parcels || 0;
    const totalPickupParcels = performanceData.total_pickup_parcels || 0;
    const averageDeliveryTime = performanceData.average_delivery_time || 0;
    const averageProcessingTime = performanceData.average_processing_time || 0;
    const averageCustomerRating = performanceData.average_customer_rating || 0;
    const totalComplaints = performanceData.total_complaints || 0;

    // Calculate derived metrics
    const customerComplaintRate = parcelCount
      ? totalComplaints / parcelCount
      : 0;

    const parcelsInProgress = parcelCount - (totalDeliveredParcels + totalPickupParcels);

    // Prepare dashboard data
    const dashboardData = {
      mainBranchCount,
      regionalHubCount,
      localOfficeCount,
      mainBranchManagerCount,
      operationsHeadCount,
      regionalHubManagerCount,
      localOfficeManagerCount,
      deliveryPersonnelCount,
      customerCount,
      parcelCount,
      totalDeliveredParcels,
      totalPickupParcels,
      averageDeliveryTime,
      averageProcessingTime,
      averageCustomerRating,
      totalComplaints,
      customerComplaintRate,
      parcelsInProgress
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching dashboard data "  + error});
  }
}

export const profile = async (req, res, next) => {
  try {
    const adminId = req.userId;

    // Update the admin's details
    const Admin = await HighPrivilege.findById(adminId).select('name email');

    if (!Admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      message: 'Admin details',
      Admin
    });
  } catch (error) {
    next(error);
  }
};
