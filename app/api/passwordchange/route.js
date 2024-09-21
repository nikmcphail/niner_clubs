/**
 * Route: POST /passwordchange
 * Description: This route handles the password change functionality for authenticated users.
 * It verifies the user's current password, hashes the new password, and updates it in the database.
 * 
 * Security:
 * - Ensures the current password is validated before allowing a change.
 * - Uses bcrypt to securely hash the new password before saving.
 * 
 * Usage:
 * - Endpoint: POST /passwordchange
 * - Request body: { currentPassword: string, newPassword: string }
 * - Requires a valid userId, typically passed via authentication or session management.
 * 
 * Dependencies:
 * - bcryptjs: For hashing and comparing passwords.
 * - User model: Used to interact with the user data in the MongoDB database.
 * - NextResponse: Used for handling responses in Next.js API routes.
 * 
 * Author: Seemo
 * Date: 9/21/2024
 */

import { connectDB } from "@/app/lib/mongodb"; // Import your database connection utility
import User from "@/app/models/user"; // Import your User model
import bcrypt from 'bcrypt'; // For hashing and comparing passwords
import { NextResponse } from "next/server"; // For Next.js responses

export async function POST(request) {
    try {
        // Connect to the database
        await connectDB();

        // Extract currentPassword and newPassword from the request body
        const { currentPassword, newPassword } = await request.json();

        // Assume that userId is passed through authentication middleware or session and can be accessed here
        // For demo purposes, we fetch the userId from query params. Modify as needed.
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }

        // Compare the current password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid current password' }, { status: 400 });
        }

        // Hash the new password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password with the new hashed password
        user.password = hashedPassword;

        // Save the updated user object
        await user.save();

        // Return a success message
        return NextResponse.json({ message: 'Password changed successfully' });
    } catch (error) {
        // Log error to the console for debugging
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
