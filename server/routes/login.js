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

router.post('/provider', upload.single('profilePhoto'), async (req, res) => {
    const { data } = req.body
    const image = req.file  
    console.log(data)
    console.log(image)
    try {

    }
    catch (err) {

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