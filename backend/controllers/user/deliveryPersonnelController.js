import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import DeliveryPersonnel from '../../models/users/DeliveryPersonnel.js'; 
import Parcel from '../../models/Parcel/Parcel.js';
import MainBranch from '../../models/branch/MainBranch.js';
import MainBranchPerformanceLog from '../../models/performance logs/MainBranchPerformanceLog.js';
import RegionalHub from '../../models/branch/RegionalHub.js';
import RegionalHubPerformanceLog from '../../models/performance logs/RegionalHubPerformanceLog.js';
import LocalOffice from '../../models/branch/LocalOffice.js';
import _ from 'lodash';

export const createDeliveryPersonnel = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Determine the branch_id and branch_type based on userRole
    let branch_id;
    let branch_type;

    if (req.userRole === 'main branch manager') {
      branch_id = req.branchId;  // Use branchId for main branch manager
      branch_type = 'Main Branch';  // Set branch type as 'MainBranch'
    } else if (req.userRole === 'regional hub manager') {
      branch_id = req.regionalHubId;  // Use regionalHubId for regional hub manager
      branch_type = 'Regional Hub';  // Set branch type as 'RegionalHub'
    } else if (req.userRole === 'local office manager') {
      branch_id = req.localOfficeId;  // Use localOfficeId for local office manager
      branch_type = 'Local Office';  // Set branch type as 'LocalOffice'
    } else {
      // Handle case where userRole is not valid
      return res.status(400).json({ message: 'Invalid role for creating delivery personnel' });
    }

    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new delivery personnel object
    const newDeliveryPersonnel = new DeliveryPersonnel({
      name,
      email,
      password: hashedPassword,
      branch_id,
      branch_type,
    });

    // Save to the DeliveryPersonnel collection
    await newDeliveryPersonnel.save();

    // Send response
    res.status(201).json({ message: 'Delivery Personnel created successfully' });
  } catch (error) {
    next(error);
  }
};

// export const readDeliveryPersonnel = async (req, res, next) => {
//   try {
//     const { userRole, branchId, regionalHubId, localOfficeId } = req;
//     const { page = 1, limit = 10, search } = req.query;

//     const limitNumber = Number(limit) || 10;
//     const skip = (page - 1) * limitNumber;

//     let filter = {};

//     // Apply branch_type and branch_id filter based on userRole
//     if (userRole !== 'admin') {
//       switch (userRole) {
//         case 'main branch manager':
//           filter.branch_type = 'Main Branch';
//           filter.branch_id = new mongoose.Types.ObjectId(branchId);
//           break;
//         case 'regional hub manager':
//           filter.branch_type = 'Regional Hub';
//           filter.branch_id = new mongoose.Types.ObjectId(regionalHubId);
//           break;
//         case 'local office manager':
//           filter.branch_type = 'Local Office';
//           filter.branch_id = new mongoose.Types.ObjectId(localOfficeId);
//           break;
//         default:
//           return res.status(403).json({ message: 'Unauthorized access' });
//       }
//     }

//     // Apply search filter if provided
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//       ];
//     }

//     const personnels = await DeliveryPersonnel.aggregate([
//       { $match: filter },
//       {
//         $facet: {
//           mainBranch: [
//             { $match: { branch_type: 'Main Branch' } },
//             {
//               $lookup: {
//                 from: 'mainbranches',
//                 localField: 'branch_id',
//                 foreignField: '_id',
//                 as: 'branchDetails',
//               },
//             },
//             { $unwind: { path: '$branchDetails', preserveNullAndEmptyArrays: true } },
//           ],
//           regionalHub: [
//             { $match: { branch_type: 'Regional Hub' } },
//             {
//               $lookup: {
//                 from: 'regionalhubs',
//                 localField: 'branch_id',
//                 foreignField: '_id',
//                 as: 'branchDetails',
//               },
//             },
//             { $unwind: { path: '$branchDetails', preserveNullAndEmptyArrays: true } },
//           ],
//           localOffice: [
//             { $match: { branch_type: 'Local Office' } },
//             {
//               $lookup: {
//                 from: 'localoffices',
//                 localField: 'branch_id',
//                 foreignField: '_id',
//                 as: 'branchDetails',
//               },
//             },
//             { $unwind: { path: '$branchDetails', preserveNullAndEmptyArrays: true } },
//           ],
//         },
//       },
//       {
//         $project: {
//           personnels: {
//             $concatArrays: ['$mainBranch', '$regionalHub', '$localOffice'],
//           },
//         },
//       },
//       { $unwind: '$personnels' },
//       { $replaceRoot: { newRoot: '$personnels' } },
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
//             country: '$branchDetails.country',
//           },
//         },
//       },
//       { $skip: skip },
//       { $limit: limitNumber },
//     ]);

//     const totalCount = await DeliveryPersonnel.countDocuments(filter);
//     const totalPages = Math.ceil(totalCount / limitNumber);

//     res.json({
//       totalCount,
//       totalPages,
//       currentPage: parseInt(page),
//       personnels,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const readDeliveryPersonnel = async (req, res, next) => {
  try {
    const { userRole, branchId, regionalHubId, localOfficeId } = req;
    const { page = 1, limit = 10, search } = req.query;

    const limitNumber = Number(limit) || 10;
    const skip = (page - 1) * limitNumber;

    let filter = {};

    // Apply branch_type and branch_id filter based on userRole
    if (userRole !== 'admin') {
      switch (userRole) {
        case 'main branch manager':
          filter.branch_type = 'Main Branch';
          filter.branch_id = new mongoose.Types.ObjectId(branchId);
          break;
        case 'regional hub manager':
          filter.branch_type = 'Regional Hub';
          filter.branch_id = new mongoose.Types.ObjectId(regionalHubId);
          break;
        case 'local office manager':
          filter.branch_type = 'Local Office';
          filter.branch_id = new mongoose.Types.ObjectId(localOfficeId);
          break;
        default:
          return res.status(403).json({ message: 'Unauthorized access' });
      }
    }

    // Apply search filter if provided
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch personnel data
    const personnels = await DeliveryPersonnel.find(filter,'_id name email branch_id branch_type')
      .skip(skip)
      .limit(limitNumber);

    const personnelWithBranchDetails = await Promise.all(
      personnels.map(async (personnel) => {
        if (!personnel.branch_id) {
          return {
            ...personnel._doc,
            branch: null, // No branch details if branch_id is missing
          };
        }

        let branchDetails = null;

        // Fetch branch details based on branch_type
        switch (personnel.branch_type) {
          case 'Main Branch':
            branchDetails = await MainBranch.findById(personnel.branch_id);
            break;
          case 'Regional Hub':
            branchDetails = await RegionalHub.findById(personnel.branch_id);
            break;
          case 'Local Office':
            branchDetails = await LocalOffice.findById(personnel.branch_id);
            break;
        }

        return {
          ...personnel._doc,
          branch: branchDetails
            ? {
                branch_id: branchDetails._id,
                branch_code: branchDetails.branch_code,
                city: branchDetails.city,
                state: branchDetails.state,
                country: branchDetails.country,
              }
            : null,
        };
      })
    );

    // Count total personnel for pagination
    const totalCount = await DeliveryPersonnel.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNumber);

    res.json({
      totalCount,
      totalPages,
      currentPage: parseInt(page),
      personnels: personnelWithBranchDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const assignDelivery = async (req, res, next) => {
  try {
    const { id } = req.params; // Delivery personnel ID
    const { parcel_id, deliveryType } = req.body; // Parcel ID and delivery type
    const { userRole, branchId, regionalHubId,localOfficeId } = req; // Role and branch identifiers

    // Step 1: Check the role and determine the branch ID
    let assignedBranchId;
    let branchIdToCompare;
    if (userRole === "main branch manager") {
      assignedBranchId = branchId;
      branchIdToCompare = branchId;
    } else if (userRole === "regional hub manager") {
      assignedBranchId = regionalHubId;
      branchIdToCompare = regionalHubId;
    } else if (userRole === "local office manager") {
      branchIdToCompare = localOfficeId;
    }

    // Step 4: Update the parcel's assignedTo and deliveryType fields
    const parcel = await Parcel.findById(parcel_id);
    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found." });
    }

    const branch_Id = parcel.track_status[parcel.track_status.length - 1].branch_id.toString();
    
    if (branchIdToCompare.toString() !== branch_Id) {
      return res.status(403).json({ message: "You cannot assign personnel now." });
    }
    
    // Step 2: Find the delivery personnel by ID
    const personnel = await DeliveryPersonnel.findById(id);
    if (!personnel) {
      return res.status(404).json({ message: "Delivery personnel not found." });
    }
    
    parcel.assignedTo = personnel._id;
    parcel.deliveryType = deliveryType;
    await parcel.save();
    
    // Step 3: Append parcel to personnel's parcels array
    personnel.parcels.push({
      parcel_id,
      status: "pending",
      deliveryType,
    });
    await personnel.save();

    if(assignedBranchId){
      // Step 5: Calculate processing time
      const lastStatus = parcel.track_status?.slice(-1)[0]; // Fetch last status data
      if (!lastStatus) {
        return res.status(400).json({ message: "Parcel tracking data is incomplete." });
      }
      const currentDate = new Date();
      const lastStatusDate = new Date(lastStatus.date);
      const processingTime = Math.floor((currentDate - lastStatusDate) / 60000); // Difference in minutes
  
      // Step 6: Update branch performance_tracking
      const branchModel = userRole === "main branch manager" ? MainBranch : RegionalHub;
      const branch = await branchModel.findById(assignedBranchId);
      if (!branch) {
        return res.status(404).json({ message: "Branch not found." });
      }

      const performanceTracking = branch.performance_tracking || { average_processing_time: 0, total_assign_delivery: 0 };
      const { average_processing_time, total_assign_delivery } = performanceTracking;
  
      const totalProcessingTime = average_processing_time * total_assign_delivery + processingTime;
      const newTotalAssignDelivery = total_assign_delivery + 1;
      const newAverageProcessingTime = totalProcessingTime / newTotalAssignDelivery;

      // Preserve existing fields in performance_tracking and update specific fields
      branch.performance_tracking = {
        ...branch.performance_tracking, // Retain existing fields
        average_processing_time: newAverageProcessingTime,
        total_assign_delivery: newTotalAssignDelivery,
      };
      await branch.save();

      // Step 7: Update performance logs
      const PerformanceLogModel = userRole === "main branch manager"
        ? MainBranchPerformanceLog
        : RegionalHubPerformanceLog;

      let performanceLog = await PerformanceLogModel.findOne({ branch_id: assignedBranchId });
      if (!performanceLog) {
        performanceLog = new PerformanceLogModel({
          branch_id: assignedBranchId,
          performance_measure: [],
        });
      }

      const currentDateLog = performanceLog.performance_measure.find(
        (log) => log.date.toDateString() === currentDate.toDateString()
      );

      if (currentDateLog) {
        // Update only the fields in the log for the current date
        currentDateLog.average_processing_time = 
          (currentDateLog.average_processing_time * currentDateLog.total_assign_delivery + processingTime) /
          (currentDateLog.total_assign_delivery + 1);
        currentDateLog.total_assign_delivery += 1;
      } else {
        // Add a new log entry for the current date
        performanceLog.performance_measure.push({
          date: currentDate,
          total_parcels: 0, // Adjust as needed
          total_delivered_parcel: 0,
          total_on_time_delivered_parcel: 0,
          average_delivery_time: 0,
          average_processing_time: processingTime,
          delivery_attempted: 0,
          damaged_in_transit: 0,
          lost_in_transit: 0,
          average_customer_rating: 0,
          total_complaints: 0,
          total_assign_delivery: 1,
        });
      }
      await performanceLog.save();
    }

    res.status(200).json({ message: "Delivery assigned successfully.", personnel, parcel });
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

// export const getAssignedDeliveries = async (req, res, next) => {
//   try {
//     const { userId } = req;
//     const { search, deliveryType, limit = 10 } = req.query;

//     // Find delivery personnel and their assigned parcels
//     const personnel = await DeliveryPersonnel.findById(userId).select('parcels');
//     if (!personnel) {
//       return res.status(404).json({ message: "Delivery personnel not found." });
//     }

//     // Filter parcels to include only those with status "Pending"
//     const pendingParcels = personnel.parcels.filter(parcel => parcel.status === "pending");

//     // Create query filters for the Parcel collection
//     const parcelFilter = {
//       _id: { $in: pendingParcels.map(parcel => parcel.parcel_id) }
//     };

//     // Apply search filter
//     if (search) {
//       parcelFilter.$or = [
//         { sender_name: { $regex: search, $options: 'i' } },
//         { recipient_name: { $regex: search, $options: 'i' } },
//         { recipient_address: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Apply delivery type filter
//     if (deliveryType) {
//       parcelFilter.deliveryType = deliveryType;
//     }

//     // Fetch parcels with specified fields only and apply limit
//     const parcels = await Parcel.find(parcelFilter)
//       .select('sender_name sender_contact recipient_name recipient_contact recipient_address status deliveryType')
//       .limit(parseInt(limit));

//     res.status(200).json(parcels);
//   } catch (error) {
//     next(error); // Pass error to the next middleware
//   }
// };

export const getAssignedDeliveries = async (req, res, next) => {
  try {
    const { userId } = req;
    const { search, deliveryType, limit = 10 } = req.query;

    // Find delivery personnel and their assigned parcels
    const personnel = await DeliveryPersonnel.findById(userId).select('parcels');
    if (!personnel) {
      return res.status(404).json({ message: "Delivery personnel not found." });
    }

    // Filter parcels to include only pending parcels
    const pendingParcelsMap = new Map(
      personnel.parcels
        .filter(parcel => parcel.status === "pending")
        .map(parcel => [parcel.parcel_id.toString(), parcel.deliveryType])
    );

    if (!pendingParcelsMap.size) {
      return res.status(200).json([]);
    }

    // Create query filters for the Parcel collection
    const parcelFilter = {
      _id: { $in: [...pendingParcelsMap.keys()] }
    };

    // Apply search filter
    if (search) {
      parcelFilter.$or = [
        { sender_name: { $regex: search, $options: 'i' } },
        { recipient_name: { $regex: search, $options: 'i' } },
        { recipient_address: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply delivery type filter
    if (deliveryType) {
      parcelFilter._id.$in = parcelFilter._id.$in.filter(parcelId =>
        pendingParcelsMap.get(parcelId) === deliveryType
      );
    }

    // Fetch parcels with specified fields only and apply limit
    const parcels = await Parcel.find(parcelFilter)
      .select('_id sender_name sender_contact recipient_name recipient_contact recipient_address status')
      .limit(parseInt(limit));

    // Include deliveryType from pendingParcels
    const parcelsWithDeliveryType = parcels.map(parcel => ({
      ..._.pick(parcel.toObject(), [
        '_id',
        'sender_name',
        'sender_contact',
        'recipient_name',
        'recipient_contact',
        'recipient_address',
        'status'
      ]),
      deliveryType: pendingParcelsMap.get(parcel._id.toString())
    }));

    res.status(200).json(parcelsWithDeliveryType);
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

export const getCompletedDeliveries = async (req, res, next) => {
  try {
    const { userId } = req;
    const { search, deliveryType, limit = 10 } = req.query;

    // Find delivery personnel and their assigned parcels
    const personnel = await DeliveryPersonnel.findById(userId).select('parcels');
    if (!personnel) {
      return res.status(404).json({ message: "Delivery personnel not found." });
    }

    // Filter parcels to include only those with status "completed"
    const completedParcels = personnel.parcels.filter(parcel => parcel.status === "completed");

    // Map deliveryType from completedParcels and fetch parcel IDs
    const deliveryData = completedParcels.map(parcel => ({
      parcel_id: parcel.parcel_id,
      deliveryType: parcel.deliveryType,
    }));

    const parcelFilter = {
      _id: { $in: deliveryData.map(data => data.parcel_id) },
    };

    // Apply search filter
    if (search) {
      parcelFilter.$or = [
        { sender_name: { $regex: search, $options: 'i' } },
        { recipient_name: { $regex: search, $options: 'i' } },
        { recipient_address: { $regex: search, $options: 'i' } },
      ];
    }

    // Apply delivery type filter
    if (deliveryType) {
      const filteredIds = deliveryData
        .filter(data => data.deliveryType === deliveryType)
        .map(data => data.parcel_id);
      parcelFilter._id.$in = filteredIds;
    }

    // Fetch parcels from Parcel collection with additional details
    const parcels = await Parcel.find(parcelFilter)
      .select('sender_name recipient_name recipient_address status')
      .limit(parseInt(limit));

    // Attach deliveryType from completedParcels to each parcel
    const response = parcels.map(parcel => {
      const matchingDelivery = deliveryData.find(data => data.parcel_id.toString() === parcel._id.toString());
      return {
        ...parcel.toObject(),
        deliveryType: matchingDelivery?.deliveryType || null,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

export const updateDeliveryPersonnel = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Create an object for fields to update
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) updateFields.password = bcrypt.hashSync(password, 10);

    // Update the delivery personnel's details
    const updatedDeliveryPersonnel = await DeliveryPersonnel.findOneAndUpdate(
      { _id: req.userId },
      updateFields,
      { new: true }
    ).select('name email branch_id branch_type');

    if (!updatedDeliveryPersonnel) {
      return res.status(404).json({ message: 'Delivery personnel not found' });
    }

    // Determine the collection to fetch branch details from based on branch_type
    let branchDetails;
    if (updatedDeliveryPersonnel.branch_type === 'Local Office') {
      branchDetails = await LocalOffice.findById(updatedDeliveryPersonnel.branch_id).select(
        'branch_code city state country'
      );
    } else if (updatedDeliveryPersonnel.branch_type === 'Regional Hub') {
      branchDetails = await RegionalHub.findById(updatedDeliveryPersonnel.branch_id).select(
        'branch_code city state country'
      );
    } else if (updatedDeliveryPersonnel.branch_type === 'Main Branch') {
      branchDetails = await MainBranch.findById(updatedDeliveryPersonnel.branch_id).select(
        'branch_code city state country'
      );
    }

    if (!branchDetails) {
      return res.status(404).json({ message: 'Branch details not found' });
    }

    res.json({
      message: 'Delivery personnel updated successfully',
      deliveryPersonnel: updatedDeliveryPersonnel,
      branchDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const changeBranch = async (req, res, next) => {
  try {
    const { id } = req.params; // ID of the delivery personnel to update
    const { branch_type, branch_id } = req.body; // New branch type and branch ID

    // Convert branchId to ObjectId
    const branchObjectId = new mongoose.Types.ObjectId(branch_id);

    // Update branch_type and branch_id in the DeliveryPersonnel collection
    const updatedPersonnel = await DeliveryPersonnel.findByIdAndUpdate(
      id,
      { branch_type, branch_id:branchObjectId },
      { new: true }
    ).select('branch_type branch_id');

    if (!updatedPersonnel) {
      return res.status(404).json({ message: 'Delivery personnel not found' });
    }

    res.json({
      message: 'Branch updated successfully for delivery personnel',
      deliveryPersonnel: updatedPersonnel,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDeliveryPersonnel = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Fetch the delivery personnel to get the branch ID
    const personnel = await DeliveryPersonnel.findById(id);
    
    if (!personnel) {
      return res.status(404).json({ message: 'Delivery personnel not found' });
    }

    // Check user role and branch ownership before allowing deletion
    if (req.userRole === 'admin') {
      // Admins can delete directly
      await DeliveryPersonnel.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Delivery personnel deleted successfully' });
    } 

    // For Main Branch Manager
    if (req.userRole === 'main branch manager' && req.branchId === String(personnel.branch_id)) {
      await DeliveryPersonnel.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Delivery personnel deleted successfully' });
    } 

    // For Regional Hub Manager
    if (req.userRole === 'regional hub manager' && req.regionalHubId === String(personnel.branch_id) ) {
      await DeliveryPersonnel.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Delivery personnel deleted successfully' });
    } 

    // For Local Office Manager
    if (req.userRole === 'local office manager' && req.localOfficeId === String(personnel.branch_id)) {
      await DeliveryPersonnel.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Delivery personnel deleted successfully' });
    }

    // If none of the conditions match, the user is not authorized
    return res.status(403).json({ message: "You don't have permission to delete this delivery personnel" });

  } catch (error) {
    next(error);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const personnelId = req.userId;

    // Fetch the delivery personnel record
    const personnel = await DeliveryPersonnel.findById(personnelId).select("parcels complaint_ids");

    if (!personnel) {
      return res.status(404).json({ error: "Delivery personnel not found" });
    }

    // Calculate total assigned and completed deliveries
    const totalAssignedDeliveries = personnel.parcels.filter(parcel => parcel.status === "pending").length;
    const totalCompletedDeliveries = personnel.parcels.filter(parcel => parcel.status !== "pending").length;

    // Count the number of complaints
    const numberOfComplaints = personnel.complaint_ids.length;

    // Prepare dashboard data
    const dashboardData = {
      totalAssignedDeliveries,
      totalCompletedDeliveries,
      numberOfComplaints
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    next(error);
  }
}

export const profile = async (req, res, next) => {
  try {
    // Update the delivery personnel's details
    const deliveryPersonnel = await DeliveryPersonnel.findById(req.userId).select('name email branch_id branch_type');

    if (!deliveryPersonnel) {
      return res.status(404).json({ message: 'Delivery personnel not found' });
    }

    // Determine the collection to fetch branch details from based on branch_type
    let branchDetails;
    if (deliveryPersonnel.branch_type === 'Local Office') {
      branchDetails = await LocalOffice.findById(deliveryPersonnel.branch_id).select(
        'branch_code city state country'
      );
    } else if (deliveryPersonnel.branch_type === 'Regional Hub') {
      branchDetails = await RegionalHub.findById(deliveryPersonnel.branch_id).select(
        'branch_code city state country'
      );
    } else if (deliveryPersonnel.branch_type === 'Main Branch') {
      branchDetails = await MainBranch.findById(deliveryPersonnel.branch_id).select(
        'branch_code city state country'
      );
    }

    if (!branchDetails) {
      return res.status(404).json({ message: 'Branch details not found' });
    }

    res.json({
      message: 'Delivery personnel details',
      deliveryPersonnel: deliveryPersonnel,
      branchDetails,
    });
  } catch (error) {
    next(error);
  }
};