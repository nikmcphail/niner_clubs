import { connectDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import Club from "@/app/models/club";
import Announcement from "@/app/models/announcement";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

export async function PUT(request, { params }) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id: clubId, announcementId } = params;
        const userId = session.user.id;

        await connectDB();

        // Find the club and verify announcement belongs to it
        const club = await Club.findById(clubId);
        if (!club || !club.announcements.includes(announcementId)) {
            return NextResponse.json({ message: 'Announcement not found in this club' }, { status: 404 });
        }

        // Check if user is admin or owner
        const userRole = await Club.getHighestRole(userId, clubId);
        if (userRole !== 'admin' && userRole !== 'owner') {
            return NextResponse.json({ message: 'Unauthorized to edit announcement' }, { status: 403 });
        }

        // Get updated data from request
        const { title, description } = await request.json();

        // Update announcement
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            announcementId,
            { title, description },
            { new: true }
        );

        return NextResponse.json({ 
            message: 'Announcement updated successfully',
            announcement: updatedAnnouncement 
        });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating announcement', error: error.message }, { status: 500 });
    }
}
