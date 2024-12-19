import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRouter.js'
import branchRouter from './routes/branchRoutes.js'
import userRouter from './routes/userRoutes.js'
import parcelRouter from './routes/parcelRoutes.js'
import cron from 'node-cron';
import updatePerformanceMetrics from './utils/updatePerformanceMetrics.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Example route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Use the routers
app.use('/api/auth', authRouter);
app.use('/api/branch', branchRouter);
app.use('/api/user', userRouter);
app.use('/api/parcel', parcelRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
});

cron.schedule('0 0 * * *', updatePerformanceMetrics); // Runs at midnight daily
// cron.schedule('*/1 * * * *', updatePerformanceMetrics); 
