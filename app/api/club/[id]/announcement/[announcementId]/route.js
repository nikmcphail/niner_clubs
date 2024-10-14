import { connectDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import Club from "@/app/models/club";
import User from "@/app/models/user";
import Announcement from "@/app/models/announcement";

export async function GET(request, {params}) {
    try {
        // Get clubId and announcementId from URL
        const clubId = params.id;
        const announcementId = params.announcementId;

        // Check if clubId is non-empty
        if (!clubId) {
            return NextResponse.json({message: 'Club ID is required.'}, {status: 400});
        }

        // Check if announcementId is non-empty
        if (!announcementId) {
            return NextResponse.json({message: 'Announcement ID is required.'}, {status: 400});
        }

        await connectDB();

        // Make sure club exists in the database
        const club = await Club.findById(clubId);

        if (!club) {
            return NextResponse.json({message: 'Club could not be found in database.'}, {status: 400});
        }

        // Make sure announcement is part of this club
        const isAnnouncementInClub = await club.announcements.includes(announcementId);

        if (!isAnnouncementInClub) {
            return NextResponse.json({ message: 'Announcement not found in this club.' }, { status: 404 });
        }

        // Find the announcement and make sure it exists in the database, also send through creator details
        const announcement = await Announcement.findById(announcementId).populate('creator');

        if (!announcement) {
            return NextResponse.json({message: 'Announcement not found in database.'}, {status: 404});
        }

        // Format timestamp for better readability client-side
        const formattedTimestamp = new Date(announcement.timestamp).toLocaleString();

        // Return announcement details
        return NextResponse.json({
            title: announcement.title,
            description: announcement.description,
            creator: {
                firstname: announcement.creator.firstname,
                lastname: announcement.creator.lastname
            },
            timestamp: formattedTimestamp
        }, {status: 200});

    } catch (err) {
        return NextResponse.json({ message: 'An error occurred.', error: err.message }, { status: 500 });
    }
}