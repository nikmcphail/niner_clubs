"use server";
import { connectDB } from "../lib/mongodb";
import User from "../models/user";
import bcrypt from 'bcrypt';

export const register = async(values) => {
    const {firstname, lastname, email, password} = values;
    const validationError = {};

    try {
        await connectDB();
        const userFound = await User.findOne({email});

        if (userFound) {
            return {
                error: "Account with email already exists."
            };
        } 

        if (password.length < 10) {
            validationError.password = "Password must be at least 10 characters.";
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const user = new User({
            firstname,
            lastname,
            email,
            password: hashedPass
        });

        const savedUser = await user.save();

        if (savedUser) {
            return {success: true};
        }

    } catch (err) {
        if (err.name === 'ValidationError')
        {
            const errorMessages = {};
            Object.keys(err.errors).forEach((field) => {
                errorMessages[field] = err.errors[field].message;
            });


            return {errors: {...validationError, ...errorMessages}};
        }

        return {error: "An unexpected error occured."};
    }
}