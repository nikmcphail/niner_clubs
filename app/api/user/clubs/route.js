import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import Club from "@/app/models/club";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        await connectDB();

        // Get userId from the query parameters
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
        }

        // Find the user and populate the clubs they belong to
        const user = await User.findById(userId).populate('clubs').exec();

        if (!user) {
            return NextResponse.json({ message: 'User not found in database.' }, { status: 404 });
        }

        // Find clubs where the user is designated as the owner
        const ownedClubs = await Club.find({ owner: userId }).exec();

        // Combine both clubs where the user is a member and where they are the owner
        const result = {
            clubs: user.clubs,
            ownedClubs: ownedClubs
        };

        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        console.error(err.message);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
