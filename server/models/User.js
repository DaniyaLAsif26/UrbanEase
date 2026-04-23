import mongoose from "mongoose"
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user'], required: true, default: 'user' },
    address: {
        area: { type: String, required: true },
        street: { type: String, required: true },
        landmark: { type: String }
    }
}, { timestamps: true })

export default mongoose.model('User', userSchema)