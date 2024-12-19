import mongoose from 'mongoose';
// import bcryptjs from 'bcryptjs'
// import HighPrivilege from '../models/HighPrivilege.js'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // const password = 'admin1234'; // Plain text password
        // const hashedPassword = bcryptjs.hashSync(password, 10); // Hashing the password with a cost factor of 10

        // // Example: Create a new user
        // const newUser = new HighPrivilege ({
        //     name: 'Administrator',
        //     email: 'admin@admin.com',
        //     password: hashedPassword,
        //     role:'admin'
        // });

        // await newUser.save().then(user => {
        //     console.log('User created:', user);
        //     }).catch(err => {
        //     console.error('Error creating user:', err);
        //     });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
