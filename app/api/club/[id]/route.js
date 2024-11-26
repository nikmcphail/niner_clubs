import { connectDB } from "@/app/lib/mongodb";
import Club from "@/app/models/club";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        const clubId = params.id;

        await connectDB();

        if (!clubId) {
            return NextResponse.json({ message: 'Club ID is required.' }, { status: 400 });
        }

        const club = await Club.findById(clubId)
            .populate('owner', 'firstname lastname email')
            .populate('members.userId', 'firstname lastname email')
            .populate({
                path: 'announcements',
                options: { sort: { 'timestamp': -1 } }, // Sort by timestamp in descending order
                populate: {
                    path: 'creator',
                    select: 'firstname lastname'
                }
            });

        if (!club) {
            return NextResponse.json({ message: 'Club could not be found in database.' }, { status: 404 });
        }

        let userRole = 'none';
        let isCurrentUserMember = false;

        if (session && session.user) {
            const userId = session.user.id;
            if (club.owner._id.toString() === userId) {
                userRole = 'owner';
                isCurrentUserMember = true;
            } else if (club.members.some(member => member.userId._id.toString() === userId)) {
                userRole = 'member';
                isCurrentUserMember = true;
            }
        }

        return NextResponse.json({
            _id: club._id,
            name: club.name,
            description: club.description,
            owner: {
                _id: club.owner._id,
                firstname: club.owner.firstname,
                lastname: club.owner.lastname,
                email: club.owner.email
            },
            members: club.members.map(member => ({
                _id: member.userId._id,
                firstname: member.userId.firstname,
                lastname: member.userId.lastname,
                email: member.userId.email,
                joinedAt: member.joinedAt
            })),
            announcements: club.announcements.map(announcement => ({
                _id: announcement._id,
                title: announcement.title,
                description: announcement.description,
                creator: {
                    firstname: announcement.creator.firstname,
                    lastname: announcement.creator.lastname
                },
                timestamp: announcement.timestamp
            })),
            userRole,
            isCurrentUserMember
        });
    } catch (error) {
        console.error('Error fetching club info:', error);
        return NextResponse.json({ message: 'An error occurred while fetching club info', error: error.message }, { status: 500 });
    }
}

