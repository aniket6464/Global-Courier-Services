import ParcelRequest from '../../models/Parcel/ParcelRequest.js'
import Customer from '../../models/users/Customer.js';
import Complaint from '../../models/CustomerFeedback/Complaint.js';
import Feedback from '../../models/CustomerFeedback/Feedback.js';
import DeliveryPersonnel from '../../models/users/DeliveryPersonnel.js';
import Parcel from '../../models/Parcel/Parcel.js';
import MainBranch from '../../models/branch/MainBranch.js';
import RegionalHub from '../../models/branch/RegionalHub.js';
import LocalOffice from '../../models/branch/LocalOffice.js';
import LocalOfficePerformanceLog from '../../models/performance logs/LocalOfficePerformanceLog.js';
import RegionalHubPerformanceLog from '../../models/performance logs/RegionalHubPerformanceLog.js';
import MainBranchPerformanceLog from '../../models/performance logs/MainBranchPerformanceLog.js';
import Review from '../../models/CustomerFeedback/Review.js';
import bcrypt from 'bcryptjs';

export const createRequest = async (req, res, next) => {
    try {
        // Create a new request with provided details and set request_status to "Pending"
        const newRequest = await ParcelRequest.create({
            ...req.body,
            request_status: 'Pending',
            customer_id:req.userId
        });

        res.status(201).json(newRequest);
    } catch (error) {
        next(error);
    }
};

export const editRequest = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Update request fields based on request body
        const updatedRequest = await ParcelRequest.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json(updatedRequest);
    } catch (error) {
        next(error);
    }
};

export const withdrawRequest = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find and delete the request by ID
        const deletedRequest = await ParcelRequest.findByIdAndDelete(id);

        if (!deletedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json({ message: 'Request successfully withdrawn' });
    } catch (error) {
        next(error);
    }
};

export const readParcel = async (req, res, next) => {
  try {
    const { userId } = req;
    const { search, status, limit = 10, page = 1 } = req.query;

    // Fetch order history for the customer
    const customer = await Customer.findById(userId).select('order_history');
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    // Filter order history to include only parcels with "Pending" status
    const pendingParcels = customer.order_history
      .filter(order => order.status === "pending")
      .map(order => order.parcel_id);

    // Create query filters for the Parcel collection
    const parcelFilter = {
      _id: { $in: pendingParcels }
    };

    // Apply search filter if provided
    if (search) {
      parcelFilter.$or = [
        { tracking_no: { $regex: search, $options: 'i' } },
        { sender_name: { $regex: search, $options: 'i' } },
        { recipient_name: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply status filter if provided
    if (status) {
      parcelFilter.status = status;
    }

    // Parse limit and page into integers
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    // Fetch total count of parcels matching the filters
    const totalCount = await Parcel.countDocuments(parcelFilter);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / parsedLimit);

    // Fetch parcels with pagination and specified fields
    const parcels = await Parcel.find(parcelFilter)
      .select('tracking_number sender_name recipient_name status')
      .skip((parsedPage - 1) * parsedLimit) // Skip documents for the current page
      .limit(parsedLimit);

    // Respond with parcels and pagination metadata
    res.status(200).json({
      totalCount,
      totalPages,
      currentPage: parsedPage,
      parcels
    });
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
};

export const getParcelHistory = async (req, res, next) => {
    try {
      const { userId } = req;
      const { search, status } = req.query;
  
      // Fetch order history for the customer
      const customer = await Customer.findById(userId).select('order_history');
      if (!customer) {
        return res.status(404).json({ message: "Customer not found." });
      }
  
      // Filter order history to include only parcels with "Completed" status
      const completedParcels = customer.order_history
        .filter(order => order.status === "completed")
        .map(order => order.parcel_id);
  
      // Create query filters for the Parcel collection
      const parcelFilter = {
        _id: { $in: completedParcels }
      };
  
      // Apply search filter if provided
      if (search) {
        parcelFilter.$or = [
          { tracking_no: { $regex: search, $options: 'i' } },
          { sender_name: { $regex: search, $options: 'i' } },
          { recipient_name: { $regex: search, $options: 'i' } }
        ];
      }
  
      // Apply status filter if provided
      if (status) {
        parcelFilter.status = status;
      }
  
      // Fetch parcels with specified fields only and apply limit
      const parcels = await Parcel.find(parcelFilter)
        .select('tracking_number sender_name recipient_name status')
        // .limit(parseInt(limit));
  
      res.status(200).json(parcels);
    } catch (error) {
      next(error); // Pass error to the next middleware
    }
};
  
export const rateParcel = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { rating } = req.body;
  
      // Check if rating is provided and is a valid number between 1 and 5
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
      }
  
      // Fetch the parcel by ID
      const parcel = await Parcel.findById(id);
      if (!parcel) {
        return res.status(404).json({ message: "Parcel not found." });
      }
  
      // Check if the status is either "Pickup" or "Delivered"
      if (parcel.status !== "Pickup" && parcel.status !== "Delivered") {
        return res.status(400).json({ message: "Rating can only be added for parcels with 'Pickup' or 'Delivered' status." });
      }
  
      // Update the rating in the Parcel collection
      parcel.rating = rating;
      await parcel.save();

      for (const status of parcel.track_status) {
        const { status: parcelStatus, branch_id } = status;
      
        // today Date
        const today = new Date().toISOString().split('T')[0];
      
        // Function to update performance log
        const updatePerformanceLog = async (logModel, branchId, today, customerRating) => {
          let performanceLog = await logModel.findOne({ branch_id: branchId });
      
          if (!performanceLog) {
            performanceLog = new logModel({
              branch_id: branchId,
              performance_measure: [],
            });
          }
      
          let currentLog = performanceLog.performance_measure.find(
            (log) => log.date.toISOString().split('T')[0] === today
          );
      
          if (currentLog) {
            const totalCustomerRating = currentLog.average_customer_rating * currentLog.total_customers || 0;
            currentLog.total_customers += 1;
            currentLog.average_customer_rating = (totalCustomerRating + customerRating) / currentLog.total_customers;
          } else {
            currentLog = {
              date: new Date(),
              total_parcels: 0,
              total_delivered_parcel: 0,
              total_on_time_delivered_parcel: 0,
              average_delivery_time: 0,
              average_processing_time: 0,
              delivery_attempted: 0,
              damaged_in_transit: 0,
              lost_in_transit: 0,
              average_customer_rating: customerRating || 0,
              total_complaints: 0,
              total_customers: 1,
            }
            performanceLog.performance_measure.push(currentLog);
          }

          // Update the modified dailyLog back into the array
          const currentLogIndex = performanceLog.performance_measure.findIndex(
            (entry) => entry.date.toISOString().split('T')[0] === today
          );
          if (currentLogIndex > -1) {
            performanceLog.performance_measure[currentLogIndex] = currentLog;
          }

          await performanceLog.save();
        };
      
        // For Local Office statuses
        if (["At Local Office", "At Destination Local Office"].includes(parcelStatus)) {      
          // Update Local Office complaints and customer rating
          const localOffice = await LocalOffice.findById(branch_id);
          if (localOffice) {
            const totalCustomerRating = localOffice.performance_tracking.average_customer_rating * localOffice.performance_tracking.total_customers || 0;
            localOffice.performance_tracking.total_customers += 1;
            localOffice.performance_tracking.average_customer_rating = (totalCustomerRating + rating) / localOffice.performance_tracking.total_customers;
            await localOffice.save();
          }
      
          await updatePerformanceLog(LocalOfficePerformanceLog, branch_id, today, rating);
        }
      
        // For Regional Hub statuses
        if (["At Regional Hub", "At Destination Regional Hub"].includes(parcelStatus)) {      
          // Update Regional Hub complaints and customer rating
          const regionalHub = await RegionalHub.findById(branch_id);
          if (regionalHub) {
            const totalCustomerRating = regionalHub.performance_tracking.average_customer_rating * regionalHub.performance_tracking.total_customers || 0;
            regionalHub.performance_tracking.total_customers += 1;
            regionalHub.performance_tracking.average_customer_rating = (totalCustomerRating + rating) / regionalHub.performance_tracking.total_customers;
            await regionalHub.save();
          }
      
          await updatePerformanceLog(RegionalHubPerformanceLog, branch_id, today, rating);
        }
      
        // For Main Branch statuses
        if (["At Main Branch", "At Destination Main Branch"].includes(parcelStatus)) {      
          // Update Main Branch complaints and customer rating
          const mainBranch = await MainBranch.findById(branch_id);
          if (mainBranch) {
            const totalCustomerRating = mainBranch.performance_tracking.average_customer_rating * mainBranch.performance_tracking.total_customers || 0;
            mainBranch.performance_tracking.total_customers += 1;
            mainBranch.performance_tracking.average_customer_rating = (totalCustomerRating + rating) / mainBranch.performance_tracking.total_customers;
            await mainBranch.save();
          }
      
          await updatePerformanceLog(MainBranchPerformanceLog, branch_id, today, rating);
        }
      }

      // After completing the rating, update the customer's order history
      const customerId = req.userId;
      const customer = await Customer.findById(customerId);

      if (customer) {
        const order = customer.order_history.find(order => order.parcel_id.toString() === parcel._id.toString());
        
        order.status = 'completed';
        await customer.save();
      }
  
      res.status(200).json({ message: "Rating added successfully.", rating: parcel.rating });
    } catch (error) {
      next(error); // Pass error to the next middleware
    }
};
  
export const updateCustomer = async (req, res, next) => {
  try {
    const { name, email, password, contact, address } = req.body;

    // Create an object for fields to update
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) updateFields.password = bcrypt.hashSync(password, 10);
    if (contact) updateFields.contact = contact;
    if (address) updateFields.address = address;

    // Update the customer's details
    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: req.userId },
      updateFields,
      { new: true }
    ).select('name email contact address');

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({
      message: 'Customer updated successfully',
      customer: updatedCustomer,
    });
  } catch (error) {
    next(error);
  }
};

export const writeReview = async (req, res, next) => {
  try {
    const customerId = req.userId; // Assuming req.userId contains the customer's ID
    const { experience, review } = req.body;

    const customer = await Customer.findById(customerId);

    // Create a new review document
    const newReview = new Review({
      customerName: customer.name,
      experience,
      review
    });

    // Save the review to the database
    await newReview.save();

    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    next(error);
  }
};

export const fileComplaint = async (req, res) => {
  const { trackingId, complaintType, complaintDescription } = req.body;
  const customerId = req.userId;

  try {
    // Find the parcel by tracking number
    const parcel = await Parcel.findOne({ tracking_number: trackingId });
    if (!parcel) {
      return res.status(404).json({ success: false, message: 'Parcel not found' });
    }

    // Fetch assigned personnel (if any) and tracking status
    const { assignedTo, track_status } = parcel;

    // Retrieve customer name
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Save the complaint
    const complaint = new Complaint({
      complaintType,
      complaintDescription,
      customerName: customer.name,
    });
    const savedComplaint = await complaint.save();

    // Add complaint ID to personnel's complaint list if assignedTo exists
    if (assignedTo) {
      await DeliveryPersonnel.findByIdAndUpdate(assignedTo, {
        $push: { complaint_ids: savedComplaint._id }
      });
    }

    // Loop through track status to store complaint in respective branch
    for (const status of track_status) {
      const { status: parcelStatus, branch_id } = status;

      // For Local Office statuses
      if (["At Local Office", "At Destination Local Office"].includes(parcelStatus)) {
        if (complaintType === "local office" || complaintType === "delivery personnel") {
          // Update Local Office complaints
          await LocalOffice.findByIdAndUpdate(branch_id, {
            $push: { complaint_ids: savedComplaint._id },
            $inc: { "performance_tracking.total_complaints": 1 },
          });

          // Update Local Office performance log
          const currentDate = new Date();
          const localOfficeLog = await LocalOfficePerformanceLog.findOne({ branch_id });
          if (!localOfficeLog) {
            performanceLog = new LocalOfficePerformanceLog({
              branch_id,
              performance_measure: [],
            });
          }
          const currentLog = localOfficeLog.performance_measure.find(
            (log) => log.date.toDateString() === currentDate.toDateString()
          );

          if (currentLog) {
            currentLog.total_complaints += 1;
          } else {
            localOfficeLog.performance_measure.push({
              date: currentDate,
              total_parcels: 0, // Adjust as necessary
              total_delivered_parcel: 0,
              total_on_time_delivered_parcel: 0,
              average_delivery_time: 0,
              average_processing_time: 0,
              delivery_attempted: 0,
              damaged_in_transit: 0,
              lost_in_transit: 0,
              average_customer_rating: 0,
              total_complaints: 1,
            });
          }
          await localOfficeLog.save();
          
        }
      }

      // For Regional Hub statuses
      if (["At Regional Hub", "At Destination Regional Hub"].includes(parcelStatus)) {
        if (complaintType !== "main branch") {
          // Update Regional Hub complaints
          await RegionalHub.findByIdAndUpdate(branch_id, {
            $push: { complaint_ids: savedComplaint._id },
            $inc: { "performance_tracking.total_complaints": 1 },
          });

          // Update Regional Hub performance log
          const currentDate = new Date();
          const regionalHubLog = await RegionalHubPerformanceLog.findOne({ branch_id });
          if (!regionalHubLog) {
            performanceLog = new RegionalHubPerformanceLog({
              branch_id,
              performance_measure: [],
            });
          }
          const currentLog = regionalHubLog.performance_measure.find(
            (log) => log.date.toDateString() === currentDate.toDateString()
          );

          if (currentLog) {
            currentLog.total_complaints += 1;
          } else {
            regionalHubLog.performance_measure.push({
              date: currentDate,
              total_parcels: 0,
              total_delivered_parcel: 0,
              total_on_time_delivered_parcel: 0,
              average_delivery_time: 0,
              average_processing_time: 0,
              delivery_attempted: 0,
              damaged_in_transit: 0,
              lost_in_transit: 0,
              average_customer_rating: 0,
              total_complaints: 1,
            });
          }
          await regionalHubLog.save();
        }
      }

      // For Main Branch statuses
      if (["At Main Branch", "At Destination Main Branch"].includes(parcelStatus)) {
        // Update Main Branch complaints
        await MainBranch.findByIdAndUpdate(branch_id, {
          $push: { complaint_ids: savedComplaint._id },
          $inc: { "performance_tracking.total_complaints": 1 },
        });

        // Update Main Branch performance log
        const currentDate = new Date();
        const mainBranchLog = await MainBranchPerformanceLog.findOne({ branch_id });
        if (!mainBranchLog) {
          performanceLog = new MainBranchPerformanceLog({
            branch_id,
            performance_measure: [],
          });
        }
        const currentLog = mainBranchLog.performance_measure.find(
          (log) => log.date.toDateString() === currentDate.toDateString()
        );

        if (currentLog) {
          currentLog.total_complaints += 1;
        } else {
          mainBranchLog.performance_measure.push({
            date: currentDate,
            total_parcels: 0, // Adjust as necessary
            total_delivered_parcel: 0,
            total_on_time_delivered_parcel: 0,
            average_delivery_time: 0,
            average_processing_time: 0,
            delivery_attempted: 0,
            damaged_in_transit: 0,
            lost_in_transit: 0,
            average_customer_rating: null,
            total_complaints: 1,
          });
        }
        await mainBranchLog.save(); 
      }
    }

    // Respond with success and complaint details
    return res.status(201).json({
      success: true,
      message: 'Complaint filed successfully',
      complaint: savedComplaint
    });
  } catch (error) {
    next(error);
  }
};

export const submitFeedback = async (req, res) => {
  const { feedback,feedbackType } = req.body;
  const customerId = req.userId;

  try {
    // Fetch the customer's name
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Create and save the feedback entry
    const newFeedback = new Feedback({
      customerName: customer.name,
      feedbackType,
      feedback,
    });
    await newFeedback.save();

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: newFeedback,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: `Failed to submit feedback: ${error.message}` });
  }
};

export const getCustomerDashboard = async (req, res, next) => {
  try {
    const customerId = req.userId;

    // Fetch the customer record
    const customer = await Customer.findById(customerId).select("order_history");

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Calculate active parcels
    const activeParcels = customer.order_history.filter(parcel => parcel.status === "pending").length;

    // Count the number of parcel requests
    const requestCount = await ParcelRequest.countDocuments({ customer_id: customerId });

    // Prepare dashboard data
    const dashboardData = {
      activeParcels,
      requestCount
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    next(error)
  }
}

export const profile = async (req, res, next) => {
  try {
    const customerId = req.userId;

    // Update the admin's details
    const customer = await Customer.findById(customerId).select('-order_history -password');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({
      message: 'customer details',
      customer
    });
  } catch (error) {
    next(error);
  }
}