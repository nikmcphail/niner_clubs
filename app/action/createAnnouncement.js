"use server";

import { connectDB } from "../lib/mongodb";
import Announcement from "../models/announcement";
import Club from "../models/club";

export const createAnnouncement = async (values) => {
    const { title, description, creator, club } = values;

    try {
        // Connect to the database
        await connectDB();

        // Check if the club exists
        const clubToUpdate = await Club.findById(club);
        if (!clubToUpdate) {
            return { error: "Club not found." };
        }

        // Get the highest role of the user in the club
        const role = await Club.getHighestRole(creator, club);

        // Allow only if the user is the owner or an admin
        if (role !== 'owner' && role !== 'admin') {
            return { error: "You do not have permission to create an announcement for this club." };
        }

        // Check if announcement with the same title exists
        const existingAnnouncement = await Announcement.findOne({ title });
        if (existingAnnouncement) {
            return { error: "Announcement already exists." };
        }

        // Create new announcement
        const announcement = new Announcement({
            title,
            description,
            creator
        });

        const savedAnnouncement = await announcement.save();

        if (savedAnnouncement) {
            // Update the club's announcements list
            const updatedClub = await Club.findByIdAndUpdate(
                club,
                { $push: { announcements: savedAnnouncement._id } },
                { new: true }
            );

            if (!updatedClub) {
                return { error: "Failed to update club's announcements." };
            }

            return { announcementId: savedAnnouncement._id.toString(), success: true };
        }

    } catch (err) {
        return { error: err.message };
    }
};
