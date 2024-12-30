import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import jsonwebtoken from 'jsonwebtoken';
import { errorHandeler } from '../utils/error.js';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcryptjs.hashSync(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })
    try {
        await newUser.save();
        res.status(201).json('User created successfully!');
    } catch (error) {
        next(error);
    }
}


export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandeler(404, 'User not found!'));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandeler(401, 'Invalid credentials!'));

        const token = jsonwebtoken.sign(
            { id: validUser._id, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, // 1 hour expiry
            process.env.JWT_SECRET
        );

        const { password: pass, ...rest } = validUser._doc;

        res.cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json({ ...rest, token });  // Send user data and token
    } catch (error) {
        next(error);
    }
};


export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User signed out successfully!');
    } catch (error) {
        next(error);
    }
}