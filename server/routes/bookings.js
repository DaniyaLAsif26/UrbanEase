import express from 'express'

const router = express.Router()

import Booking from '../models/Booking.js'
import User from '../models/User.js'

const isProduction = process.env.NODE_ENV === 'production';

import { verifyUserToken, verifyProviderToken } from '../middlewares/middlewares.js'

router.post('/', verifyUserToken, async (req, res) => {
    try {

        const user = req.user.id
        const { date, startTimeSlot, endTimeSlot } = req.body

        const toMinutes = (t) => {
            const [hours, mins] = t.split(':').map(Number)
            return hours * 60
        }

        const duration = toMinutes(endTimeSlot) - toMinutes(startTimeSlot)

        const data = {
            ...req.body,
            userId: user,
            status: 'draft',
            date: new Date(date),
            duration: duration,
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
        }

        const bookingData = new Booking(data)

        const existingUser = await User.findById(user)

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                error: "Booking error"
            })
        }

        await bookingData.save()

        return res.status(201).json({
            success: true,
            bookingData
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json(
            {
                success: false,
                error: "Error creating Bookin" + err.message,
            }
        )
    }
})

router.patch('/:id/assign/providers', verifyUserToken, async (req, res) => {
    try {
        const { providers } = req.body

        const existingBooking = await Booking.findById(req.params.id)

        if (!existingBooking) {
            return res.status(404).json({
                success: false,
                error: "Booking not found"
            })
        }

        existingBooking.status = "pending"
        existingBooking.providers = providers
        existingBooking.expiresAt = undefined
        existingBooking.notifyAll = providers.length === 0

        await existingBooking.save()

        return res.status(200).json({
            success: true,
            existingBooking
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: "Error Updating Booking" + err.message
        })
    }
})

export default router;