import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

import Provider from '../models/Provider.js'
import User from '../models/User.js'

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