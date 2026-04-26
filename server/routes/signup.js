import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import dotenv from "dotenv"
dotenv.config()

import User from "../models/User.js"
import Provider from "../models/Provider.js"

const router = express.Router()

const isProduction = process.env.NODE_ENV === 'production';

const getCookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: isProduction, // true in production (HTTPS), false in development
    // sameSite: isProduction ? "none" : "lax", // "none" for cross-origin, "lax" for same-origin
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: maxAge,
});

import { parseProviderData, providerRules, validate, userRules } from "../middlewares/middlewares.js"

router.post('/provider', providerRules, validate, async (req, res) => {

    const { name, languages, email, phone, password, area, bio, services } = req.body

    try {

        const existingProvider = await Provider.findOne({ email: email })
        if (existingProvider) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered as provider, use different email or log in as provider'
            })
        }

        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered as user, use different email or log in as user'
            })
        }

        const provider = await Provider.create({
            name,
            languages,
            email,
            phone,
            password: await bcrypt.hash(password, 10),
            area,
            bio,
            services: services.map(s => ({ category: s.category, price: s.price })),
            role: 'provider',
        })

        const providerToken = jwt.sign({
            id: provider._id,
            role: 'provider'
        },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie("providerToken", providerToken, getCookieOptions(7 * 24 * 60 * 60 * 1000))

        res.status(201).json({
            success: true,
            message: 'Provider created successfully',
            provider
        });
    }
    catch (err) {
        console.error(err)
        res.status(500).json({
            success: false,
            error: 'Error creating provider'
        });
    }
})

router.post('/user', userRules, validate, async (req, res) => {
    const { name, email, password, phone, address } = req.body

    try {
        const isProvider = await Provider.findOne({ email: email })
        if (isProvider) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered as provider, use different email or log in as provider'
            })
        }

        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered as user, use different email or log in as user'
            })
        }

        const user = await User.create({
            name,
            email,
            phone,
            password: await bcrypt.hash(password, 10),
            address,
            role: 'user'
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Error creating user'
            })
        }

        const userToken = jwt.sign({
            id: user._id,
            role: 'user'
        },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie("userToken", userToken, getCookieOptions(7 * 24 * 60 * 60 * 1000))

        return res.json({
            success: true,
            message: 'User created successfully',
            user
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Error creating user'
        });
    }
})

export default router;