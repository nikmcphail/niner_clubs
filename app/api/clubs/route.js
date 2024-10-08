import { connectDB } from "@/app/lib/mongodb";
import Club from "@/app/models/club";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();

        const clubs = await Club.find({active: true}).exec();

        return NextResponse.json(clubs, {status: 200});
    } catch (err) {
        console.error('Error fetching clubs:', err);
        return NextResponse.json({message: 'Failed to fetch clubs'}, {status: 500});
    }
}