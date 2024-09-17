"use server";
import { connectDB } from "../lib/mongodb";
import User from "../models/user";

export const register = async(values) => {
    const {firstname, lastname, email, password} = values;

    try {
        await connectDB();
        const userFound = await User.findOne({email});

        if (userFound) {
            return {
                error: "Account with email already exists."
            };
        }

        const user = new User({
            firstname,
            lastname,
            email,
            password
        });

        const savedUser = await user.save();

    } catch (err) {
        if (err.name === 'ValidationError')
        {
            return {
                error: err.message
            };
        }
    }
}