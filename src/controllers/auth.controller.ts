import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model';  

const JWT_SECRET = process.env.JWT_SECRET || "Sporton123";

export const signin = async (req: Request, res: Response) : Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "Invalid Credentials, Email Not Found" });
            return;
        }
        
        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid Credentials, Wrong Password" });
            return;
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email}, JWT_SECRET, { expiresIn: "1d" })
        res.json({ token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
         })
    } catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({ message: "Server Error" });
    }   
};

export const initiateAdmin = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {email, password, name} = req.body;

        // Check if user data already exists
        const count = await User.countDocuments({});
        if (count > 0) {
            res.status(400).json({ message: "We can only have 1 admin user, id you want to create new admin user, please delete the user manually from the  database" 
            })
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            name
        })
        await newUser.save();

        res.status(201).json({ message: "Admin user created successfully" });
    } catch (error) {
        console.error("Initiate Admin Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};