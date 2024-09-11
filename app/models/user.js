import mongoose from 'mongoose';
import {Schema} from 'mongoose';


// Schema for User
const userSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'First name is required.'],
        trim: true,
        minLength: [2, 'First name must be longer than 2 characters.']
    },
    lastname: {
        type: String,
        required: [true, 'Last name is required.'],
        trim: true,
        minLength: [2, 'Last name must be longer than 2 characters.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        match: [/^[\w.%+-]+@(uncc\.edu|charlotte\.edu)$/i, 'Invalid email address.'],
        unique: [true, 'Email must be unique.']
    },
    password: {
        type: String,
        minLength: [10, 'Password must be at least 10 characters.'],
        required: [true, 'Password is required.']
    },
    clubs: {
        type: [Schema.Types.ObjectId],
        ref: 'Club',
        default: []
    }
},
{
    timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;