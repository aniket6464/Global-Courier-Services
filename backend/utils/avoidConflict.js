import Parcel from "../models/Parcel/Parcel.js";
import RegionalHubManager from "../models/users/RegionalHubManager.js";
import LocalOfficeManager from "../models/users/LocalOfficeManager.js";

/**
 * Middleware to prevent write conflicts by acquiring a lock on the parcel.
 */
export const avoidConflict = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Fetch the parcel by ID
        const parcel = await Parcel.findById(id);

        if (!parcel) {
            return res.status(404).json({ error: 'Parcel not found' });
        }

        // Check if the parcel is already being updated
        if (parcel.updateLock) {
            return res.status(409).json({
                error: 'Conflict detected',
                message: 'Another user is currently updating this parcel. Please try again later.',
            });
        }

        // Acquire the lock by setting `updateLock` to true
        parcel.updateLock = true;
        await parcel.save();

        // Pass control to the next middleware or route handler
        next();

        // After the request completes, release the lock
        res.on('finish', async () => {
            parcel.updateLock = false;
            await parcel.save();
        });
    } catch (error) {
        next(error); // Forward errors to the error-handling middleware
    }
};

/**
 * Middleware to prevent write conflicts by acquiring a lock on the regional manager.
 */
export const ConflictForRegional = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Fetch the parcel by ID
        const regionalHubManager = await RegionalHubManager.findById(id);

        if (!regionalHubManager) {
            return res.status(404).json({ error: 'Regional Hub Manager not found' });
        }

        // Check if the parcel is already being updated
        if (regionalHubManager.updateLock) {
            return res.status(409).json({
                error: 'Conflict detected',
                message: 'Another user is currently updating this Regional Hub Manager. Please try again later.',
            });
        }

        // Acquire the lock by setting `updateLock` to true
        regionalHubManager.updateLock = true;
        await regionalHubManager.save();
        
        // Pass control to the next middleware or route handler
        next();

        // After the request completes, release the lock
        res.on('finish', async () => {
            regionalHubManager.updateLock = false;
            await regionalHubManager.save();
        });
    } catch (error) {
        next(error); // Forward errors to the error-handling middleware
    }
};

/**
 * Middleware to prevent write conflicts by acquiring a lock on the Local manager.
 */
export const ConflictForLocal = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Fetch the parcel by ID
        const localOfficeManager = await LocalOfficeManager.findById(id);

        if (!localOfficeManager) {
            return res.status(404).json({ error: 'Local Office Manager not found' });
        }

        // Check if the parcel is already being updated
        if (localOfficeManager.updateLock) {
            return res.status(409).json({
                error: 'Conflict detected',
                message: 'Another user is currently updating this Regional Hub Manager. Please try again later.',
            });
        }

        // Acquire the lock by setting `updateLock` to true
        localOfficeManager.updateLock = true;
        await localOfficeManager.save();

        // Pass control to the next middleware or route handler
        next();

        // After the request completes, release the lock
        res.on('finish', async () => {
            localOfficeManager.updateLock = false;
            await localOfficeManager.save();
        });
    } catch (error) {
        next(error); // Forward errors to the error-handling middleware
    }
};