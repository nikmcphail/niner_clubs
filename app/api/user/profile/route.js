import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
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

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error(err.message);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}