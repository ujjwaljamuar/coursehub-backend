import mongoose from "mongoose";

export const ConnectDB = async () => {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected with ${connection.host}`)
};
