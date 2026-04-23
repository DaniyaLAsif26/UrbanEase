import mongoose from "mongoose"
const Schema = mongoose.Schema

const providerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['provider'], required: true },
  area: { type: String },
  services: {
    type: [{ category: String, price: Number }],
    required: true
  },
  bio: { type: String },
  profilePhoto: { type: String , required: true},
  isApproved: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('Provider', providerSchema)