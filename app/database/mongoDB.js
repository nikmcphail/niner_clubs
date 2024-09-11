import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URI); // Attempt to connect to the database.
        const connection = mongoose.connection; 

        connection.on('connected', () => { // If we are connected successfully.
            console.log('Connected to database.');
        })

        connection.on('error', (err) => { // If there was an error connecting.
            console.log('There was an error connection to the database' + err);
        })
    } catch (error) {
        console.log(error);
    }
}