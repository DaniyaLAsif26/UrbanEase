import express from 'express'

const router = express.Router()

const isProduction = process.env.NODE_ENV === 'production';

router.delete('/admin', (req, res) => {
    res.clearCookie('adminToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    })

    res.json({
        success: true,
    })
})

router.delete('/user', (req, res) => {
    res.clearCookie('userToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    })

    res.json({
        success: true,
    })
})

router.delete('/provider', (req, res) => {
    res.clearCookie('providerToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    })

    res.json({
        success: true,
    })
})

export default router;