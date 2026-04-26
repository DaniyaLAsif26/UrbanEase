import mongoose from "mongoose";
const Schema = mongoose.Schema

const bookingSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    serviceType: {
        type: String,
        required: true,
    },
    address: {
        area: { type: String, required: true },
        street: { type: String, required: true },
        landmark: { type: String }
    },
    date: {
        required: true,
        type: Date,
    },
    startTimeSlot: {
        type: String,
        required: true
    },
    endTimeSlot: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    notifyAll: {
        type: Boolean,
        default: false
    },
    providers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Provider"
        }],
        default: []
    },
    amount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
        default: 'draft'
    },
    expiresAt: {
        type: Date,
        index: { expireAfterSeconds: 0 }
    },
    serviceDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
},
    { timestamps: true }
)

export default mongoose.model('Booking', bookingSchema)