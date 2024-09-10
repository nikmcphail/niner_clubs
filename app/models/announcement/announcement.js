import {Schema, mongoose} from 'mongoose';

const announcementSchema = new Schema({});

const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);

export default Announcement;