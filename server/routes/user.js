import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

import Provider from '../models/Provider.js'
import User from '../models/User.js'

import { verifyUserToken, verifyProviderToken } from '../middlewares/middlewares.js'


const isProduction = process.env.NODE_ENV === 'production';

router.get('/user', verifyUserToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) return res.status(404).json({ success: false, error: 'User not found' })
        return res.status(200).json({ success: true, user })
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Error fetching user' })
    }
})

router.get('/provider', verifyProviderToken, async (req, res) => {
    try {
        const provider = await Provider.findById(req.provider.id).select('-password')
        if (!provider) return res.status(404).json({ success: false, error: 'Provider not found' })
        return res.status(200).json({ success: true, provider })
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Error fetching provider' })
    }
})

router.get('/all-providers', async (req, res) => {
    try {
        const { service, area } = req.query

        if (!service || !area) {
            return res.json({
                success: false,
                error: "Service and area necessary"
            })
        }

        const allProviders = await Provider.find({
            "services.category": service,
            area: area
        })

        if (!allProviders || allProviders.length === 0) {
            return res.json({
                success: false,
                error: "No service Providers Found"
            })
        }

        return res.status(200).json({
            success: true,
            allProviders
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Error fetching provider'
        })
    }
})

export default router;