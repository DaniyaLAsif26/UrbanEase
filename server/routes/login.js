import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import multer from 'multer'

import dotenv from "dotenv"
dotenv.config()

import User from "../models/User.js"
import Provider from "../models/Provider.js"

const router = express.Router()
const upload = multer()

import { parseProviderData, providerRules, validate, userRules } from "../middlewares/middlewares.js"

router.post('/provider', upload.single('profilePhoto'), parseProviderData, providerRules, validate, async (req, res) => {
    console.log("hit")

    const { name, email, password, area, bio, services } = req.body
    const image = req.file

    if (!image) return res.status(400).json({ error: 'Profile photo required' });

    try {
        const provider = await Provider.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            area,
            bio,
            services: services.map(s => ({ category: s.category, price: s.price })),
            role: 'provider',
            // profilePhoto: { data: image.buffer, contentType: image.mimetype }
        })

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