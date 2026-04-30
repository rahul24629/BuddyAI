import express from "express";
import "dotenv/config";
import cors from 'cors';
import mongoose, { connect } from "mongoose";
import { clerkMiddleware } from "@clerk/express"; // 👈 add this
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use(clerkMiddleware()); 

app.use("/api", chatRoutes);

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected with database");
    } catch (error) {
        console.log("Failed with connected with DB", error);
    }
}
