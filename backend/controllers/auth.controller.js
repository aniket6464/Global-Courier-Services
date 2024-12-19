import HighPrivilege from '../models/users/HighPrivilege.js';
import RegionalHubManager from '../models/users/RegionalHubManager.js';
import LocalOfficeManager from '../models/users/LocalOfficeManager.js';
import DeliveryPersonnel from '../models/users/DeliveryPersonnel.js';
import Customer from '../models/users/Customer.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const signin = async (req, res, next) => {
    const { email, password, role } = req.body;

    try {
        let validUser;

        // Determine the collection based on the role
        if (['admin', 'operations head', 'main branch manager'].includes(role)) {
            validUser = await HighPrivilege.findOne({ email, role });
        } else if (role === 'regional hub manager') {
            validUser = await RegionalHubManager.findOne({ email });
        } else if (role === 'local office manager') {
            validUser = await LocalOfficeManager.findOne({ email });
        } else if (role === 'Delivery Personnel') {
            validUser = await DeliveryPersonnel.findOne({ email });
        } else if (role === 'Customer') {
            validUser = await Customer.findOne({ email });
        } else {
            return next(errorHandler(400, 'Invalid role specified.'));
        }

        // Check if the user was found
        if (!validUser) return next(errorHandler(404, 'User not found!'));

        // Check if the password is correct
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

        // Prepare JWT payload based on role
        let jwtPayload = { id: validUser._id, role };
        if (role === 'operations head') jwtPayload.overseeing_branches = validUser.overseeing_branches;
        if (role === 'main branch manager') jwtPayload.branch_id = validUser.branch_id;
        if (role === 'regional hub manager') {
            jwtPayload.main_branch_id = validUser.main_branch_id;
            jwtPayload.regional_hub_id = validUser.regional_hub_id;
        }
        if (role === 'local office manager') {
            jwtPayload.main_branch_id = validUser.main_branch_id;
            jwtPayload.regional_hub_id = validUser.regional_hub_id;
            jwtPayload.local_office_id = validUser.local_office_id;
        } 
        if (role === 'Delivery Personnel') {
            jwtPayload.branch_id = validUser.branch_id;
            jwtPayload.branch_type = validUser.branch_type;
        }

        // Create a JWT token with the prepared payload
        const token = jwt.sign(jwtPayload, process.env.JWT_SECRET);

        // Send the response with the JWT token and user data (name, email, role)
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json({ name: validUser.name, email: validUser.email, role });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req, res, next) => {
    try { 
      res.clearCookie('access_token');
      res.status(200).json('User has been logged out!');
    } catch (error) {
      next(error);
    }
};

// Signup function for a new customer
export const customerSignup = async (req, res, next) => {
    try {
        const { name, email, password, contact, address } = req.body;

        // Check if the user already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer already exists with this email.' });
        }

        // Hash the password
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // Create a new customer instance
        const newCustomer = new Customer({
            name,
            email,
            password: hashedPassword,
            contact,
            address,
        });

        // Save the customer to the database
        await newCustomer.save();

        // Exclude the password from the response
        const { password: pass, ...customerData } = newCustomer._doc;

        // Send response
        res.status(201).json({ message: 'Customer registered successfully', customer: customerData });
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};
