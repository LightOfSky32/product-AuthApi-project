const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: true,
    },
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    otp: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otpExpiry: {
        type: Date
    },
    resetPasswordToken: {
        type: String,
        default: null,
    },
    resetPasswordExpires: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true,
    versionKey: false,
});

const User = mongoose.model("User", userSchema);
module.exports = User;