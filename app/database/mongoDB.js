import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('Connected to database.');
        })

        connection.on('error', (err) => {
            console.log('There was an error connection to the database' + err);
        })
    } catch (error) {
        console.log(error);
    }
}