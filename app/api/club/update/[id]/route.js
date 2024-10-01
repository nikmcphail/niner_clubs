import { connectDB } from "@/app/lib/mongodb";
import Club from "@/app/models/club";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

// Define an asynchronous PUT function to handle club update requests
export async function PUT(request, { params }) {
    try {
        // Check if the user is authenticated
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Extract the club ID from the request parameters and user ID from the session
        const clubId = params.id;
        const userId = session.user.id;

        // Connect to the database
        await connectDB();

        // Find the club by its ID
        const club = await Club.findById(clubId);
        if (!club) {
            return NextResponse.json({ message: 'Club not found' }, { status: 404 });
        }

        // Check if the authenticated user is the owner of the club
        if (club.owner.toString() !== userId) {
            return NextResponse.json({ message: 'Only the club owner can update the club' }, { status: 403 });
        }

        // Extract the new description from the request body
        const { description } = await request.json();

        // Update the club's description
        club.description = description;
        await club.save();

        // Return a success response with the updated club data
        return NextResponse.json({ message: 'Club updated successfully', club }, { status: 200 });
    } catch (error) {
        // Handle any errors that occur during the update process
        console.error('Error updating club:', error);
        return NextResponse.json({ message: 'An error occurred while updating the club', error: error.message }, { status: 500 });
    }
} 
