import mongoose from "mongoose";
import { mongoUrl } from "./constans.js";


export const connectDb = async () => {

    const connetState = mongoose.connection.readyState;

    if (connetState === 1) {
        console.log("Already Connected")
        return
    }
    if (connetState === 2) {
        console.log("Connecting . . . ")
        return
    }

    try {
        await mongoose.connect(mongoUrl, {
            dbName: "ar-academy",
        });
        console.log("Database is Connected");
    } catch (error) {
        console.log(" Failed to Connect Database! : ", error);
    }
};