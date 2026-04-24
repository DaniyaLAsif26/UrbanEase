import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

import Provider from '../models/Provider.js'
import User from '../models/User.js'


const isProduction = process.env.NODE_ENV === 'production';

const getCookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: isProduction, // true in production (HTTPS), false in development
    // sameSite: isProduction ? "none" : "lax", // "none" for cross-origin, "lax" for same-origin
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: maxAge,
});

router.post('/provider', async (req, res) => {
    try {
        const { identifier, loginType, password } = req.body

        const provider = await Provider.findOne({ [loginType]: identifier })

        if (!provider) {
            return res.status(400).json({
                success: false,
                error: 'No provider found with the given credentials'

            })
        }

        const isMatch = await bcrypt.compare(password, provider.password)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: 'Invalid password'
            })
        }

        const providerToken = jwt.sign({
            id: provider._id,
            role: 'provider'
        },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie("providerToken", providerToken, getCookieOptions(7 * 24 * 60 * 60 * 1000))

        return res.status(200).json({
            success: true,
            message: 'Provider logged in successfully',
            provider
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Error logging in provider'
        })
    }
})


router.post('/user', async (req, res) => {
    try {
        const { identifier, loginType, password } = req.body

        const user = await User.findOne({ [loginType]: identifier })

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'No User found with the given credentials'

            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: 'Invalid password'
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

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Error logging in User'
        })
    }


})

export default router;