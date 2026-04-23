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

import { parseProviderData, providerRules, validate } from "../middlewares/middlewares.js"

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

router.post('/user', async (req, res) => {
    const { data } = req.body
    try {

    }
    catch (err) {

    }
})

export default router;