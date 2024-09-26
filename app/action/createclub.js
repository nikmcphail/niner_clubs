"use server";
import { connectDB } from "../lib/mongodb";
import Club from "../models/club";
import User from '../models/user';

export const createclub = async (values) => {
    const { name, description, userId } = values;

    try {
        // Connect to the database
        await connectDB();

        // Check if a club with the same name already exists
        const existingClub = await Club.findOne({ name: name });
        if (existingClub) {
          return { error: "Club name is already in use! P{" };
        }

        // Create a new Club
        const club = new Club({
            name,
            description,
            owner: userId,
            admins: [userId],
            members: [{ userId, joinedAt: new Date() }]
        });

        // Save the new club to the database
        const savedClub = await club.save();

        // If the club was successfully saved, update the user's clubs array
        if (savedClub) {
            // Find the user by ID and update their clubs array
            const updatedUser = await User.findByIdAndUpdate(
                userId, 
                { $push: { clubs: savedClub._id } }, // Add the club ID to the user's clubs array
                { new: true } // Return the updated user document
            );

            // Check if the user was successfully updated
            if (!updatedUser) {
                return {
                    error: "Failed to update the user's clubs."
                };
            }

            // Return success if both operations succeed
            return { clubId: savedClub._id.toString(), success: true };
        }
    } catch (err) {
        return {
            error: err.message
        };
    }
};