import express from 'express'

const router = express.Router()

import Booking from '../models/Booking.js'
import User from '../models/User.js'
import Provider from '../models/Provider.js'

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

router.get('/get/requested', verifyProviderToken, async (req, res) => {
    try {
        const providerId = req.provider.id

        const provider = await Provider.findById(providerId)

        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Service Provider not  found'
            })
        }

        const requests = await Booking.find({
            status: "pending",
            "address.area": provider?.area,
            serviceType: {
                $in: provider.services.map(s => s.category)
            },
            $or: [
                { notifyAll: true },
                { providers: providerId }
            ]
        }).populate("userId", 'name email phone')

        return res.status(200).json({
            success: true,
            requests
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
})

router.patch('/:id/accept', verifyProviderToken, async (req, res) => {
    try {

        const bookingId = req.params.id
        const providerId = req.provider.id

        const booking = await Booking.findById(bookingId)

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: "Booking not found"
            })
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, error: "Booking already accepted" })
        }

        if (!booking.notifyAll && !booking.providers.includes(providerId)) {
            return res.status(403).json({ success: false, error: "You were not requested for this booking" })
        }

        booking.status = "accepted"
        booking.providers = [providerId]

        await Promise.all([
            booking.save(),
            Provider.findByIdAndUpdate(providerId, {
                $push: { bookings: bookingId }
            })
        ])

        return res.status(200).json({
            success: true,

        })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
})

router.patch('/:id/decline', verifyProviderToken, async (req, res) => {
    try {

        const bookingId = req.params.id
        const providerId = req.provider.id

        const booking = await Booking.findById(bookingId)

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: "Booking not found"
            })
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, error: "Booking already cancelled" })
        }

        if (booking.notifyAll) {
            return res.status(200).json({ success: false, error: "No permission for declining booking" })
        }

        if (!booking.notifyAll && !booking.providers.includes(providerId)) {
            return res.status(403).json({ success: false, error: "You were not requested for this booking" })
        }

        booking.providers = booking.providers.filter(
            id => id.toString() !== providerId.toString()
        )

        if (!booking.notifyAll && booking.providers.length === 0) {
            booking.status = 'declined'
        }

        await booking.save();

        return res.status(200).json({
            success: true,
        })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
})

router.get('/all/provider', verifyProviderToken, async (req, res) => {
    try {
        const providerId = req.provider.id

        const bookings = await Booking.find({
            providers: providerId,
            status: { $in: ["accepted", "in_progress", "completed"] }
        }).sort({ date: -1 })

        return res.status(200).json({
            success: true,
            bookings
        })
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message })
    }
})

router.get('/all/user', verifyUserToken, async (req, res) => {
    try {
        const userId = req.user.id

        const bookings = await Booking.find({
            userId: userId,
            status: { $in: ["accepted", "in_progress", "completed" , "pending"] }
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