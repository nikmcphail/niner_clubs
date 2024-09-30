import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import User from './user';
import Announcement from './announcement';

const clubSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true,
        minLength: [2, 'Club name must be longer than 2 characters.']
    },
    description: {
        type: String,
        required: [true, 'Description is required.']
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Club owner is required.']
    },
    admins: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    members: [{
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    announcements: {
        type: [Schema.Types.ObjectId],
        ref: 'Announcement',
        default: []
    },
    active: {
        type: Boolean,
        default: true
    }
},

{
    timestamps: true
});

clubSchema.statics.getHighestRole = async function(userId, clubId) {
    try {
        const club = await this.findById(clubId).populate('owner admins members.userId');

        if (!club) {
            throw new Error('Club not found.');
        }

        // Convert userId to string for comparison
        const userIdStr = String(userId);
        // Extract owner ID from owner object and convert to string
        const ownerIdStr = String(club.owner._id);

        if (ownerIdStr === userIdStr) {
            return 'owner';
        }

        if (club.admins.some(admin => String(admin._id) === userIdStr)) {
            return 'admin';
        }

        const member = club.members.find(member => String(member.userId) === userIdStr);
        if (member) {
            return 'member';
        }

        return 'no role';
    } catch (error) {
        console.error('Error getting user role:', error);
        throw error;
    }
}

const Club = mongoose.models.Club || mongoose.model("Club", clubSchema);

export default Club;