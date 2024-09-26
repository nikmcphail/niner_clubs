import { NextResponse } from "next/server";
import Club from "@/app/models/club";
import { connectDB } from "@/app/lib/mongodb";

export async function GET(request, {params}) {
    try {
        const {id} = params;
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        await connectDB();

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 }); 
        }

        if (!id) {
            return NextResponse.json({ message: 'Club ID is required' }, { status: 400 });
        }

        const role = await Club.getHighestRole(userId, id);

        return NextResponse.json({role}, {status: 200});
    } catch (err) {
        console.error('Error fetching role:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}