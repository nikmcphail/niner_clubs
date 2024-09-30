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

        console.log('Attempting to leave club:', clubId, 'for user:', userId);

        await connectDB();

        const club = await Club.findById(clubId);
        if (!club) {
            console.log('Club not found:', clubId);
            return NextResponse.json({ message: 'Club not found' }, { status: 404 });
        }

        console.log('Club found:', club);

        // Find the index of the member
        const memberIndex = club.members.findIndex(member => member.userId.toString() === userId);
        if (memberIndex === -1) {
            console.log('User is not a member of this club');
            return NextResponse.json({ message: 'User is not a member of this club' }, { status: 400 });
        }

        // Remove the member
        club.members.splice(memberIndex, 1);
        console.log('Members after removal:', club.members);

        await club.save();
        console.log('Club saved successfully');

        return NextResponse.json({ message: 'Successfully left the club' }, { status: 200 });
    } catch (error) {
        console.error('Error leaving club:', error);
        return NextResponse.json({ 
            message: 'An error occurred while leaving the club', 
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
