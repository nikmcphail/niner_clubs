import {Schema, mongoose} from 'mongoose';

const userSchema = new Schema({
    fullname: {
        type: String,
        required: [true, 'Full name is required.'],
        trim: true,
        minLength: [5, 'Name must be longer than 2 characters.']
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
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;