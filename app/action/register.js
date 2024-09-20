"use server";
import { connectDB } from "../lib/mongodb";
import User from "../models/user";
import bcrypt from 'bcrypt';

export const register = async(values) => {
    const {firstname, lastname, email, password} = values; // Retrieve form values and set our variables to them.
    const validationError = {};

    try {
        await connectDB(); // Wait until we connect to the database.
        const userFound = await User.findOne({email}); 

        // Check if we already have a user with a matching email
        if (userFound) {
            return {
                error: "Account with email already exists."
            };
        } 

        // This has to be done this way due to how mongoose checks the password when we save the user.
        if (password.length < 10) {
            validationError.password = "Password must be at least 10 characters.";
        }

        // Hash pass with 10 salting passes.
        const hashedPass = await bcrypt.hash(password, 10);

        // Create user object with information provided by user.
        const user = new User({
            firstname,
            lastname,
            email,
            password: hashedPass
        });

        // Attempt to save user in the database
        const savedUser = await user.save();

        if (savedUser) {
            return {success: true};
        }

        // Retrieve all errors with validation from mongoose
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
