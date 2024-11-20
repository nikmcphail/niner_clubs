import { connectDB } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import Club from "@/app/models/club";
import Announcement from "@/app/models/announcement";

export async function GET(request) {
    try {
        await connectDB();

        const clubs = await Club.find({active: true}).populate('announcements').exec();

        const announcements = clubs.flatMap(club => club.announcements);

        return NextResponse.json(announcements, {status: 200});
    } catch (err) {
        console.error('Error fetching clubs:', err);
        return NextResponse.json({message: 'Failed to fetch announcements'}, {status: 500});
    }
}