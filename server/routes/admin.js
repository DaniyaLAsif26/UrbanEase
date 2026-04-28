import express from 'express'

const router = express.Router()

import Booking from '../models/Booking.js'
import User from '../models/User.js'
import Provider from '../models/Provider.js'

router.get('/all-users', async (req, res) => {
    try {
        const allUsers = await User.find()

        return res.status(200).json({
            success: true,
            allUsers
        }
        )
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: "server Error"
        })
    }
})

router.get('/all-providers', async (req, res) => {
    try {
        const allProviders = await Provider.find()

        return res.status(200).json({
            success: true,
            allProviders
        }
        )
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: "server Error"
        })
    }
})


export default router;