import mongoose from "mongoose"
const Schema = mongoose.Schema

const providerSchema = new Schema({
  name: { type: String, required: true },
  languages: { type: Array, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true, uique: true },
  role: { type: String, enum: ['provider'], required: true, default: 'provider' },
  available: { type: Boolean, default: true },
  area: { type: String },
  services: {
    type: [{ category: String, price: Number }],
    required: true
  },
  bio: { type: String },
  isApproved: { type: Boolean, default: false },
  bookings: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    default: null
  }
}, { timestamps: true })

export default mongoose.model('Provider', providerSchema)