import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import dotenv from "dotenv"
dotenv.config()

import User from "../models/User.js"
import Provider from "../models/Provider.js"

const router = express.Router()

import { parseProviderData, providerRules, validate, userRules } from "../middlewares/middlewares.js"

router.post('/provider', providerRules, validate, async (req, res) => {

    const { name, email,phone, password, area, bio, services } = req.body

    const existingProvider = await Provider.findOne({ email: email })
    if (existingProvider) {
        return res.status(400).json({
            success: false,
            error: 'Email already registered as provider, use different email or log in as provider'
        })
    }

    try {
        const provider = await Provider.create({
            name,
            email,
            phone,
            password: await bcrypt.hash(password, 10),
            area,
            bio,
            services: services.map(s => ({ category: s.category, price: s.price })),
            role: 'provider',
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