import {Schema, mongoose} from 'mongoose';

const clubSchema = new Schema({});

const Club = mongoose.models.Club || mongoose.model("Club", clubSchema);

export default Club;