import mongoose from "mongoose"
const Schema = mongoose.Schema

const providerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['provider'], required: true , default: 'provider'},
  available: { type: Boolean, default: true },
  area: { type: String },
  services: {
    type: [{ category: String, price: Number }],
    required: true
  },
  bio: { type: String },
  profilePhoto: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/2348/2348811.png', 
  },
  isApproved: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('Provider', providerSchema)