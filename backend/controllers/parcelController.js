import Parcel from '../models/Parcel/Parcel.js';
import ParcelRequest from '../models/Parcel/ParcelRequest.js';
import MainBranch from '../models/branch/MainBranch.js';
import RegionalHub from '../models/branch/RegionalHub.js';
import LocalOffice from '../models/branch/LocalOffice.js';
import DeliveryPersonnel from '../models/users/DeliveryPersonnel.js';
import ParcelDeliveryLog from '../models/Parcel/ParcelDeliveryLog.js';
import Customer from '../models/users/Customer.js';

// Helper function to generate unique tracking number
function generateTrackingNumber(branchCode) {
    const codePart = branchCode.slice(3); // Extract code part (e.g., "0791" from "BR-0791")
    const dateTimePart = new Date().toISOString().replace(/[-:.TZ]/g, ''); // Format as YYYYMMDDHHMMSS
    return `TN-${codePart}-${dateTimePart}`;
}

// Create Parcel function
export const createParcel = async (req, res, next) => {
  try {
      let branchCode;
      let branch_id;
      const { userRole, body } = req;

      // Fetch branch code based on user role
      if (userRole === 'main branch manager') {
          const mainBranch = await MainBranch.findById(req.branchId);
          branch_id = req.branchId;
          branchCode = mainBranch.branch_code;
      } else if (userRole === 'regional hub manager') {
          const regionalHub = await RegionalHub.findById(req.regionalHubId);
          branch_id = req.regionalHubId;
          branchCode = regionalHub.branch_code;
      } else if (userRole === 'local office manager') {
          const localOffice = await LocalOffice.findById(req.localOfficeId);
          branch_id = req.localOfficeId;
          branchCode = localOffice.branch_code;
      }

      // Generate tracking number
      const trackingNumber = generateTrackingNumber(branchCode);

      // Determine status based on role
      let status;
      if (userRole === 'main branch manager') {
          status = "At Main Branch";
      } else if (userRole === 'regional hub manager') {
          status = "At Regional Hub";
      } else if (userRole === 'local office manager') {
          status = "At Local Office";
      }

      // Create parcel object
      const newParcel = new Parcel({
          ...body,
          tracking_number: trackingNumber,
          status,
          track_status: [
              { status: "Created", branch_id },
              { status, branch_id },
          ],
      });

      // Save the parcel
      await newParcel.save();

      // Append the parcel ID to the respective branch's parcel_ids array
      const updateQuery = { $push: { parcel_ids: newParcel._id } };

      if (userRole === 'main branch manager') {
          await MainBranch.findByIdAndUpdate(branch_id, updateQuery);
      } else if (userRole === 'regional hub manager') {
          await RegionalHub.findByIdAndUpdate(branch_id, updateQuery);
      } else if (userRole === 'local office manager') {
          await LocalOffice.findByIdAndUpdate(branch_id, updateQuery);
      }

      // Return the created parcel
      res.status(201).json(newParcel);
  } catch (error) {
      next(error);
  }
};

export const readParcels = async (req, res, next) => {
  try {
      const { search, sort, limit, page, status } = req.query;

      // Default pagination settings
      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      // Build the query object
      let query = req.parcelIds ? { _id: { $in: req.parcelIds } } : {};
      
      // Add search filter
      if (search) {
          query.$or = [
              { tracking_number: { $regex: search, $options: 'i' } },
              { sender_name: { $regex: search, $options: 'i' } },
              { recipient_name: { $regex: search, $options: 'i' } },
              { status: { $regex: search, $options: 'i' } }
          ];
      }

      // Add status filter if provided
      if (status) {
          query.status = status;
      }

      // Build sort options
      const sortOptions = {};
      if (sort) {
        const sortFields = sort.split(',');
        sortFields.forEach(field => {
            sortOptions[field] = 1; // Ascending order
        });
      }

      // Fetch parcels with query, sorting, and pagination
      const parcels = await Parcel.find(query, 'tracking_number sender_name recipient_name status assignedTo')
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNumber);

      // Get the total count for pagination info
      const totalCount = await Parcel.countDocuments(query);

      // Send response with pagination details
      res.json({
          totalCount,
          totalPages: Math.ceil(totalCount / limitNumber),
          currentPage: pageNumber,
          parcels
      });
  } catch (error) {
      next(error);
  }
};

export const readParcelById = async (req, res, next) => {
  try {
      // Find the parcel by ID and exclude the track_status field
      const parcel = await Parcel.findById(req.params.id, '-track_status');
      
      if (!parcel) {
          return res.status(404).json({ message: 'Parcel not found' });
      }

      res.json(parcel);
  } catch (error) {
      next(error);
  }
};

export const updateParcel = async (req, res, next) => {
  try {
      const { id } = req.params;
      const { branchId, regionalHubId, localOfficeId, userRole } = req; // Branch IDs and user role from the request

      const parcel = await Parcel.findById(id);
      const lastTrack = parcel.track_status[parcel.track_status.length - 1];
      const branchIdToCompare = lastTrack.branch_id;  

      if (userRole === 'main branch manager' && branchIdToCompare.toString() !== branchId) {
        return res.status(403).json({ message: "You cannot update this parcel now." });
      } else if (userRole === 'regional hub manager' && branchIdToCompare.toString() !== regionalHubId) {
        return res.status(403).json({ message: "You cannot update this parcel now." });
      } else if (userRole === 'local office manager' && branchIdToCompare.toString() !== localOfficeId) {
        return res.status(403).json({ message: "You cannot update this parcel now." });
      }

      // Update parcel fields based on request body
      const updatedParcel = await Parcel.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
      }).select('-track_status'); // Exclude track_status from the response

      if (!updatedParcel) {
          return res.status(404).json({ message: 'Parcel not found' });
      }

      res.json(updatedParcel);
  } catch (error) {
      next(error);
  }
};

export const readRequests = async (req, res, next) => {
  try {
      const { search, status, limit, page } = req.query;

      // Default pagination settings
      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      // Build the query object based on user role
      let query = {};
      if (req.userRole === 'Customer') {
          query.customer_id = req.userId;
      } else {
          query.branch_id = req.localOfficeId;
      }

      // Add search filter
      if (search) {
          query.$or = [
              { sender_name: { $regex: search, $options: 'i' } },
              { recipient_name: { $regex: search, $options: 'i' } },
              { data: { $regex: search, $options: 'i' } }
          ];
      }

      // Add status filter if provided
      if (status) {
          query.request_status = status;
      }

      // Fetch requests with query, pagination, and limit
      const requests = await ParcelRequest.find(query)
          .skip(skip)
          .limit(limitNumber);

      // Get the total count for pagination info
      const totalCount = await ParcelRequest.countDocuments(query);

      // Send response with pagination details
      res.json({
          totalCount,
          totalPages: Math.ceil(totalCount / limitNumber),
          currentPage: pageNumber,
          requests
      });
  } catch (error) {
      next(error);
  }
};

export const readRequestById = async (req, res, next) => {
  try {
      const { id } = req.params;

      // Find the request by ID
      const request = await ParcelRequest.findById(id);

      // Check if request exists and belongs to the local office
      if (!request) {
          return res.status(404).json({ message: 'Request not found' });
      }
      
      if (req.userRole !=="Customer" && request.branch_id != req.localOfficeId) {
          return res.status(403).json({ message: 'Access denied' });
      }

      res.json(request);
  } catch (error) {
      next(error);
  }
};

export const resolveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Fetch the ParcelRequest by the given ID
    const request = await ParcelRequest.findById(id);

    // Check if the request exists and if the branch_id matches req.localOfficeId
    if (!request || request.branch_id.toString() !== req.localOfficeId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if the status is "Rejected"
    if (status === "Rejected") {
      // Update status in ParcelRequest collection to "Rejected"
      await ParcelRequest.findByIdAndUpdate(id, { request_status: "Rejected" });
      return res.status(200).json({ message: "Request rejected successfully." });
    }

    // Fetch local office and branch details
    const localOffice = await LocalOffice.findById(req.localOfficeId);
    const branch_id = req.localOfficeId;
    const branchCode = localOffice.branch_code;

    // Generate tracking number
    const tracking_number = generateTrackingNumber(branchCode);

    // Extract required data from the request
    const {
      sender_name,
      sender_address,
      sender_contact,
      recipient_name,
      recipient_address,
      recipient_contact,
      type,
      parcel_details,
      customer_id
    } = request;

    // Create parcel data
    const parcelData = {
      tracking_number,
      status: "Awaiting Pickup",
      track_status: [
        { status: "Created", branch_id },
        { status: "Awaiting Pickup", branch_id }
      ],
      sender_name,
      sender_address,
      sender_contact,
      recipient_name,
      recipient_address,
      recipient_contact,
      type,
      parcel_details,
    };

    // Save the parcel data in the Parcel collection
    const newParcel = new Parcel(parcelData);
    await newParcel.save();

    // Add the new parcel ID to the local office's parcel_ids array
    localOffice.parcel_ids.push(newParcel._id);
    await localOffice.save();

    // Update the customer's order_history with the new parcel ID and status as "Pending"
    if (customer_id) {
      await Customer.findByIdAndUpdate(customer_id, {
        $push: {
          order_history: { parcel_id: newParcel._id, status: "pending" }
        }
      });
    }

    // Delete the original request in ParcelRequest
    await ParcelRequest.findByIdAndDelete(id);

    res.status(200).json({ message: "Request resolved and parcel created successfully." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while resolving the request.", error });
  }
};
  
export  const deleteParcel = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      // Fetch the parcel by ID
      const parcel = await Parcel.findById(id);
      if (!parcel) {
        return res.status(404).json({ message: "Parcel not found." });
      }
  
      // Define the statuses that allow deletion
      const allowedStatuses = [
        "At Local Office",
        "At Regional Hub",
        "At Main Branch",
        "At Destination Main Branch",
        "At Destination Regional Hub",
        "At Destination Local Office"
      ];
  
      // Check if parcel status is in the allowed statuses
      if (!allowedStatuses.includes(parcel.status)) {
        return res.status(400).json({ message: "Parcel cannot be deleted at its current status." });
      }
  
      // Delete the parcel
      await Parcel.findByIdAndDelete(id);
      res.status(200).json({ message: "Parcel deleted successfully." });
    } catch (error) {
      next(error); // Pass error to the next middleware
    }
};

export const trackParcel = async (req, res, next) => {
  try {
    const { track } = req.params;

    // Fetch the track_status field of the parcel by track
    const parcel = await Parcel.findOne({ tracking_number: track }).select('track_status');
    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found." });
    }

    // Process each track status entry
    const trackDetails = await Promise.all(
      parcel.track_status.map(async (status) => {
        const { branch_id, status: currentStatus ,date } = status;

        if (!branch_id) {
          // If branch_id is not present, return status info only
          return { status: currentStatus, branch: null , date};
        }

        // Attempt to find the branch in Main Branch, Regional Hub, or Local Office
        let branch =
          (await MainBranch.findById(branch_id).select('branch_code city state country')) ||
          (await RegionalHub.findById(branch_id).select('branch_code city state country')) ||
          (await LocalOffice.findById(branch_id).select('branch_code city state country'));

        // Return status and branch details
        return {
          status: currentStatus,
          date,
          branch: branch || null, // Include branch details or null if not found
        };
      })
    );

    res.status(200).json(trackDetails);
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

export const trackParcelByid = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch the track_status field of the parcel by track
    const parcel = await Parcel.findById(id).select('track_status');
    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found." });
    }
    const track_status = parcel.track_status;

    res.status(200).json(track_status[track_status.length-2].status);
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

export const updateParcelStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // Parcel ID
    const { status, branch_id } = req.body; // New status
    const { branchId, regionalHubId, localOfficeId, userRole } = req; // Branch IDs and user role from the request

    // Find the parcel by ID
    const parcel = await Parcel.findById(id);
    if (!parcel) {
      return res.status(404).json({ message: "Parcel not found." });
    }

    // Define status groups
    const removeFieldsStatuses = [
      "At Local Office", "Delivery Attempted", "Damaged in Transit", "Lost in Transit",
      "Delivered", "At Regional Hub", "At Main Branch", "At Destination Local Office",
      "At Destination Main Branch", "At Destination Regional Hub"
    ];
    const heldStatuses = [
      "Held at Main Branch", "Held at Regional Hub", "Ready to Pickup (at the branch)", "Pickup"
    ];
    const branchStatusGroup = [
      "At Local Office", "At Regional Hub", "At Main Branch",
      "At Destination Local Office", "At Destination Main Branch", "At Destination Regional Hub"
    ];

    // Case 1: Statuses requiring field removal and Delivery Personnel update
    if (removeFieldsStatuses.includes(status)) {
      if(status != "Delivered"){
        // Remove `assignedTo` and `deliveryType`
        parcel.assignedTo = undefined;
        parcel.deliveryType = undefined;
      }

      // Update status in DeliveryPersonnel collection
      const deliveryPersonnel = await DeliveryPersonnel.findOne({ branch_id: branchId });
      if (deliveryPersonnel) {
        const parcelIndex = deliveryPersonnel.parcels.map(p => p.parcel_id.toString()).lastIndexOf(id);
        if (parcelIndex !== -1) {
          deliveryPersonnel.parcels[parcelIndex].status = "completed";
        }
        await deliveryPersonnel.save();
      }
    }

    // Case 2: Held statuses requiring branch_id validation
    const lastTrack = parcel.track_status[parcel.track_status.length - 1];
    const secondLastTrack = parcel.track_status[parcel.track_status.length - 2];
    const branchIdToCompare = lastTrack.branch_id || secondLastTrack.branch_id;
    if (heldStatuses.includes(status)) {
      if (userRole === 'main branch manager' && branchIdToCompare.toString() !== branchId) {
        return res.status(403).json({ message: "You cannot update this parcel's status now." });
      } else if (userRole === 'regional hub manager' && branchIdToCompare.toString() !== regionalHubId) {
        return res.status(403).json({ message: "You cannot update this parcel's status now." });
      } else if (userRole === 'local office manager' && branchIdToCompare.toString() !== localOfficeId) {
        return res.status(403).json({ message: "You cannot update this parcel's status now." });
      }
    }

    // Case 3: Push parcel ID to branch `parcel_ids` array
    if (branchStatusGroup.includes(status) && branch_id) {
      const branchUpdate =
        status.includes("Regional Hub")
          ? RegionalHub
          : status.includes("Main Branch")
          ? MainBranch
          : LocalOffice;

      await branchUpdate.findByIdAndUpdate(
        branch_id,
        { $addToSet: { parcel_ids: id } }, // Use `$addToSet` to avoid duplicate entries
        { new: true }
      );
    }

    // **New Logic**: Case 4: Add parcel ID to ParcelDeliveryLog for Delivered or Pickup statuses
    if (status === "Delivered" || status === "Pickup" || 
      status === 'Delivery Attempted' || status === 'Damaged in Transit' || status === 'Lost in Transit') {
      await ParcelDeliveryLog.findOneAndUpdate(
        {}, // Find the relevant document (you can add filters if necessary)
        { $addToSet: { parcel_id: id } }, // Add parcel ID to the array
        { upsert: true, new: true } // Create the document if it doesn't exist
      );
    }

    // Update the status
    parcel.status = status;

    // Append to the track_status array
    parcel.track_status.push({
      status,
      ...(branch_id ? { branch_id } : branchIdToCompare ? { branch_id: branchIdToCompare } : {})
    });

    // Save the updated parcel
    await parcel.save();

    res.status(200).json({
      message: "Parcel status updated successfully.",
      track_status: parcel.track_status,
    });
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

export const generateParcelStatusReport = async (req, res, next) => {
    try {
      const { status, startDate, endDate } = req.query;
      const filter = {};
  
      // Add status filter if provided
      if (status) {
        filter.status = status;
      }
  
      // Add date range filter if both startDate and endDate are provided
      if (startDate && endDate) {
        filter.date_created = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
  
      // Fetch parcels with selected fields only
      const parcels = await Parcel.find(filter).select('date_created sender_name recipient_name status');
  
      res.status(200).json(parcels);
    } catch (error) {
      next(error); // Pass error to the next middleware
    }
};
  