import Parcel from '../models/Parcel/Parcel.js';
import ParcelDeliveryLog from '../models/Parcel/ParcelDeliveryLog.js';
import MainBranch from '../models/branch/MainBranch.js';
import RegionalHub from '../models/branch/RegionalHub.js';
import LocalOffice from '../models/branch/LocalOffice.js';
import MainBranchPerformanceLog from '../models/performance logs/MainBranchPerformanceLog.js';
import RegionalHubPerformanceLog from '../models/performance logs/RegionalHubPerformanceLog.js';
import LocalOfficePerformanceLog from '../models/performance logs/LocalOfficePerformanceLog.js';
import performanceTracking from '../models/performance logs/performanceTrackingSchema.js'

const updatePerformanceMetrics = async () => {
  try {
    const logs = await ParcelDeliveryLog.find();
    if (!logs.length) return;

    const systemPerformance = await performanceTracking.findOne();
    if (!systemPerformance) {
      throw new Error("System performance tracking document not found.");
    }

    for (const log of logs) {
      const { parcel_id: parcelIds } = log;

      for (const parcelId of parcelIds) {
        const parcel = await Parcel.findById(parcelId);
        if (!parcel) continue;

        const { track_status, type } = parcel;

        for (let i = 0; i < track_status.length - 2; i++) {
          const currentStatus = track_status[i];
          let nextStatus = track_status[i + 1];
          let evaluatedStatus = track_status[i + 2];

          // Adjust evaluatedStatus if nextStatus is a "Held" status
          if (
            ['Held at Main Branch', 'Held at Regional Hub'].includes(
              nextStatus.status
            )
          ) {
            nextStatus = track_status[i + 2];
            evaluatedStatus = track_status[i + 3];
          }

          if (!evaluatedStatus) continue;

          const { status, branch_id } = currentStatus;

          let branch, PerformanceLog;
          if (status.includes('Main Branch')) {
            branch = await MainBranch.findById(branch_id);
            PerformanceLog = MainBranchPerformanceLog;
          } else if (status.includes('Regional Hub')) {
            branch = await RegionalHub.findById(branch_id);
            PerformanceLog = RegionalHubPerformanceLog;
          } else if (status.includes('Local Office')) {
            branch = await LocalOffice.findById(branch_id);
            PerformanceLog = LocalOfficePerformanceLog;
          }

          // Validate PerformanceLog before using it
          if (!branch) {
            continue;
          }

          // Update PerformanceLog for the branch
          let performanceLog = await PerformanceLog.findOne({ branch_id });
          if (!performanceLog) {
            performanceLog = new PerformanceLog({
              branch_id,
              performance_measure: [],
            });
          }

          // Proceed with updating or creating the daily log
          const today = new Date().toISOString().split('T')[0];
          let dailyLog = performanceLog.performance_measure.find(
            (entry) => entry.date.toISOString().split('T')[0] === today
          );

          if (!dailyLog) {
            dailyLog = {
              date: new Date(),
              total_parcels: 0,
              total_delivered_parcel: 0,
              total_on_time_delivered_parcel: 0,
              average_delivery_time: 0,
              average_processing_time: 0,
              delivery_attempted: 0,
              damaged_in_transit: 0,
              lost_in_transit: 0,
              total_complaints: 0,
            };
            performanceLog.performance_measure.push(dailyLog);
          }

          if (!branch || !PerformanceLog) continue;

          const { performance_tracking } = branch;

          // Increment total_delivered_parcels based on conditions
          if (
            (status === 'At Local Office' && type !== 'Pickup' &&
              ['Delivered', 'At Regional Hub'].includes(evaluatedStatus.status)) ||
            (status === 'At Regional Hub' && type !== 'Pickup' &&
              ['At Main Branch', 'At Destination Local Office'].includes(evaluatedStatus.status)) ||
            (status === 'At Main Branch' && type !== 'Pickup' &&
              ['At Destination Main Branch', 'At Destination Regional Hub'].includes(evaluatedStatus.status)) ||
            (status === 'At Destination Local Office' && type !== 'Pickup' &&
              evaluatedStatus.status === 'Delivered') ||
            (status === 'At Destination Regional Hub' && type !== 'Pickup' &&
              evaluatedStatus.status === 'At Destination Local Office') ||
            (status === 'At Destination Main Branch' && type !== 'Pickup' &&
              evaluatedStatus.status === 'At Destination Regional Hub') ||
            (status === 'At Local Office' && type === 'Pickup' &&
              ['At Regional Hub'].includes(evaluatedStatus.status)) ||
            (status === 'At Regional Hub' && type === 'Pickup' &&
              ['At Main Branch', 'At Destination Local Office'].includes(evaluatedStatus.status)) ||
            (status === 'At Main Branch' && type === 'Pickup' &&
              ['At Destination Main Branch', 'At Destination Regional Hub'].includes(evaluatedStatus.status)) ||
            (status === 'At Destination Regional Hub' && type === 'Pickup' &&
              evaluatedStatus.status === 'At Destination Local Office') ||
            (status === 'At Destination Main Branch' && type === 'Pickup' &&
              evaluatedStatus.status === 'At Destination Regional Hub')
          ) {
            performance_tracking.total_delivered_parcels += 1;
            dailyLog.total_delivered_parcel += 1;

            // Calculate delivery time
            const deliveryTime = Math.abs(
              new Date(evaluatedStatus.date) - new Date(nextStatus.date)
            ) / 36e5; // Convert ms to hours

            // Check for on-time delivery
            const promisedDeliveryTime = branch.promised_delivery_time || Infinity;
            if (deliveryTime <= promisedDeliveryTime) {
              performance_tracking.total_on_time_delivered_parcels += 1;
              dailyLog.total_on_time_delivered_parcel += 1;
            }

            // Only update averages if deliveryTime is a valid number
            if (!isNaN(deliveryTime) && deliveryTime >= 0) {
              const totalDelivered = performance_tracking.total_delivered_parcels;

              performance_tracking.average_delivery_time =
                totalDelivered > 1
                  ? (performance_tracking.average_delivery_time *
                      (totalDelivered - 1) +
                      deliveryTime) /
                    totalDelivered
                  : deliveryTime;

              const totalDailyDelivered = dailyLog.total_delivered_parcel;
              dailyLog.average_delivery_time =
                totalDailyDelivered > 1
                  ? (dailyLog.average_delivery_time *
                      (totalDailyDelivered - 1) +
                      deliveryTime) /
                    totalDailyDelivered
                  : deliveryTime;
            }
          }

          // Increment other performance metrics
          if (status === 'Pickup') {
            performance_tracking.total_pickup_parcels += 1;
            performance_tracking.total_parcels += 1;
            dailyLog.total_pickup_parcels += 1;
            dailyLog.total_parcels += 1;
            systemPerformance.total_pickup_parcels += 1;
          }
          // Increment other performance metrics
          if (status === 'Delivery Attempted') {
            performance_tracking.delivery_attempted += 1;
            performance_tracking.total_parcels += 1;
            dailyLog.delivery_attempted += 1;
            dailyLog.total_parcels += 1;
          }
          if (status === 'Damaged in Transit') {
            performance_tracking.damaged_in_transit += 1;
            performance_tracking.total_parcels += 1;
            dailyLog.damaged_in_transit += 1;
            dailyLog.total_parcels += 1;
          }
          if (status === 'Lost in Transit') {
            performance_tracking.lost_in_transit += 1;
            performance_tracking.total_parcels += 1;
            dailyLog.lost_in_transit += 1;
            dailyLog.total_parcels += 1;
          }
          if (status === 'Delivered') {
            systemPerformance.total_delivered_parcels += 1;
            performance_tracking.total_parcels += 1;
            dailyLog.total_parcels += 1;
          }

          // Update the modified dailyLog back into the array
          const dailyLogIndex = performanceLog.performance_measure.findIndex(
            (entry) => entry.date.toISOString().split('T')[0] === today
          );
          if (dailyLogIndex > -1) {
            performanceLog.performance_measure[dailyLogIndex] = dailyLog;
          }

          // Save updated performance tracking to the branch
          await branch.save();
          await performanceLog.save();
        }
      }
      // Remove all parcel IDs from the current log
      log.parcel_id = [];
      await log.save();
    }

    const mainBranches = await MainBranch.find();
    let totalComplaints = 0;
    let totalCustomers = 0;
    let bestAverageDeliveryTime = Infinity;
    let bestAverageProcessingTime = Infinity;
    let bestAverageCustomerRating = 0;

    for (const branch of mainBranches) {
      const {
        average_delivery_time,
        average_processing_time,
        average_customer_rating,
        total_complaints,
        total_customers,
      } = branch.performance_tracking;

      if (average_delivery_time < bestAverageDeliveryTime) {
        bestAverageDeliveryTime = average_delivery_time;
      }
      if (average_processing_time < bestAverageProcessingTime) {
        bestAverageProcessingTime = average_processing_time;
      }
      if (average_customer_rating > bestAverageCustomerRating) {
        bestAverageCustomerRating = average_customer_rating;
      }

      totalComplaints += total_complaints;
      totalCustomers += total_customers;
    }

    systemPerformance.average_delivery_time = bestAverageDeliveryTime;
    systemPerformance.average_processing_time = bestAverageProcessingTime;
    systemPerformance.average_customer_rating = bestAverageCustomerRating;
    systemPerformance.total_complaints = totalComplaints;
    systemPerformance.total_customers = totalCustomers;

    await systemPerformance.save();

    console.log('Performance metrics updated successfully!');
  } catch (error) {
    console.error('Error updating performance metrics:', error);
  }
};

// Schedule this function to run every 24 hours using node-cron or similar
export default updatePerformanceMetrics;
