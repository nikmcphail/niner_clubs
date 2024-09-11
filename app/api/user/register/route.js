import { connect } from "@/app/database/mongoDB";
import User from "@/app/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connect(); // Make sure we connect to database.
        const body = await request.json(); // Make sure we have the request body.
        const {fullname, email, password} = body;

        const userExists = await User.findOne({email}); // Look for user with email entered.

        // If they exist, return error.
        if (userExists) {
            return NextResponse.json({error: "User already exists"}, {status: 400}); 
        }

        /* TODO: Encrypt password before storing in database */

        // Create new user object
        const newUser = new User({
            fullname,
            email,
            password
        });

        // Make sure the user is saved in the database.
        const savedUser = await newUser.save();

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        });
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}