import dotenv from "dotenv"
dotenv.config()

import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"

import signUpRoute from "./routes/signup.js"
import loginRoute from "./routes/login.js"
import userRoutes from './routes/user.js'
import BookingRoute from './routes/bookings.js'
import AdminRoute from './routes/admin.js'

const app = express()
app.use(express.json())
app.use(cookieParser())

const isProduction = process.env.NODE_ENV === "production"

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    'https://urban-ease-steel.vercel.app',
    'https://urban-ease-daniyal-asifs-projects-2b05fd7a.vercel.app',
]

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups")
    next()
})

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, !isProduction)
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS policy does not allow this origin.'), false)
        }
        return callback(null, true)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

const PORT = process.env.PORT || 5000
const HOST = '0.0.0.0'
const MONGO_URL = process.env.ATLAS_DB_URL || 'mongodb://127.0.0.1:27017/urban'

mongoose.connect(MONGO_URL)
    .then(() => console.log("Connected To MongoDB"))
    .catch((err) => console.log(err))

app.use('/api/signup', signUpRoute)
app.use('/api/login', loginRoute)
app.use('/api/profile', userRoutes)
app.use('/api/booking', BookingRoute)
app.use('/api/admin', AdminRoute)

app.listen(PORT, HOST, () => {
    console.log(`Server running on port ${PORT}`)
})