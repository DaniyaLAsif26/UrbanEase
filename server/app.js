import dotenv from "dotenv"
dotenv.config()

import express from "express"
import mongoose from "mongoose"
import cors from "cors"

import cookieParser from "cookie-parser"

import signUpRoute from "./routes/signup.js"
import loginRoute from "./routes/login.js"

const app = express()
app.use(express.json())
app.use(cors())

app.use(cookieParser())

const PORT = process.env.PORT || 5000
const HOST = '0.0.0.0'

const MONGO_URL = process.env.ATLAS_DB_URL || 'mongodb://127.0.0.1:27017/urban'

const connectDB = async () => {
    await mongoose.connect(MONGO_URL)
}

connectDB()
    .then(async () => {
        console.log("Connected To MongoDB")
    })
    .catch((err) => {
        console.log(err)
    })

app.use('/api/signup', signUpRoute)
app.use('/api/login', loginRoute)

app.listen(PORT, HOST, () => {
    console.log(`Server running on port ${PORT}`)
})