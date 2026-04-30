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

router.get('/all-bookings', async (req, res) => {
    try {
        const allBookings = await Booking.find().populate('userId').populate('providers')

        return res.status(200).json({
            success: true,
            allBookings
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

router.get('/provider/:id', async (req, res) => {
    const provider = await Provider.findById(req.params.id)

    return res.status(200).json({
        success: true,
        provider
    })
})

router.get('/user/:id', async (req, res) => {
    const user = await User.findById(req.params.id)

    return res.status(200).json({
        success: true,
        user
    })
})

router.patch('/verify-provider/:id', async (req, res) => {

    const { isApproved } = req.body

    const provider = await Provider.findByIdAndUpdate(
        req.params.id,
        { isApproved },
        { returnDocument: 'after' }
    )

    return res.status(200).json({
        success: true,
        provider
    })
})

router.get('/provider/bookings/:id', async (req, res) => {
    try {
        const providerId = req.params.id

        const bookings = await Booking.find({
            providers: providerId,
            status: { $in: ['draft', 'pending', 'declined', 'accepted', 'in_progress', 'completed', 'cancelled'] }
        }).sort({ date: -1 })

        return res.status(200).json({
            success: true,
            bookings
        })
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message })
    }
})

router.get('/user/bookings/:id', async (req, res) => {
    try {
        const userId = req.params.id

        const bookings = await Booking.find({
            userId: userId,
            status: { $in: ['draft', 'pending', 'declined', 'accepted', 'in_progress', 'completed', 'cancelled'] }
        }).sort({ date: -1 })

        return res.status(200).json({
            success: true,
            bookings
        })
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message })
    }
})


export default router;