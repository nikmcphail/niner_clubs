import { connectDB } from "@/app/lib/mongodb";
import Club from "@/app/models/club";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
import mongoose from 'mongoose';

export async function POST(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const clubId = params.id;
        const userId = session.user.id;

        console.log('Attempting to join club:', clubId, 'for user:', userId);

        await connectDB();

        const club = await Club.findById(clubId);
        if (!club) {
            console.log('Club not found:', clubId);
            return NextResponse.json({ message: 'Club not found' }, { status: 404 });
        }

        console.log('Club found:', club);

        // Check if user is already a member
        if (club.members.some(member => member.userId.toString() === userId)) {
            console.log('User is already a member');
            return NextResponse.json({ message: 'User is already a member of this club' }, { status: 400 });
        }

        // Add the new member
        club.members.push({
            userId: new mongoose.Types.ObjectId(userId),
            joinedAt: new Date()
        });
        console.log('Members after push:', club.members);

        await club.save();
        console.log('Club saved successfully');

        return NextResponse.json({ message: 'Successfully joined the club' }, { status: 200 });
    } catch (error) {
        console.error('Error joining club:', error);
        return NextResponse.json({ 
            message: 'An error occurred while joining the club', 
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
