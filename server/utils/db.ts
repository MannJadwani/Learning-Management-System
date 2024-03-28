import mongoose from 'mongoose';

require('dotenv').config();

const dbURL: string = process.env.MONGO_URL || '';


export const connectDB = async () => {
    try {
        await mongoose.connect(dbURL)
            .then((data) => {
                console.log("Data base is connected with" + data.connection.host);
            })
    }
    catch (err) {
        console.log('Something went wrong\n', err);
        setTimeout(connectDB, 5000);
    }
}