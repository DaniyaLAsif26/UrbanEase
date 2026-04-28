import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import Admin from '../models/admin.js'
import dotenv from 'dotenv'
import path from "path";

dotenv.config({ path: path.resolve("../.env") })

const MONGO_URL = process.env.ATLAS_DB_URL || 'mongodb://127.0.0.1:27017/urban';

const connectDB = async () => {
    await mongoose.connect(MONGO_URL)
}

const initDB = async () => {
    try {
        if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_USERNAME) {
            throw new Error("ADMIN_NAME or ADMIN_PASS is missing in .env");
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
        await Admin.create({
            username: process.env.ADMIN_USERNAME,
            password: hashedPassword
        })

        console.log("✅ Admin initialized successfully")
    } catch (err) {
        console.error("❌ Error initializing data:", err);
    }
}

connectDB()
    .then(async () => {
        console.log("Connected To MongoDB")
        await initDB()
    })
    .catch((err) => {
        console.error("❌ DB Connection Failed:", err)
    })
    .finally(() => {
        mongoose.disconnect()
    })