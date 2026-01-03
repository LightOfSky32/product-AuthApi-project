const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/*
const {
    sendWelcomeEmail,
    sendLoginNotification,
    sendPasswordResetEmail,
    sendPasswordResetSuccessEmail,
    resendOtpEmail
} = require("../utils/email-services");
 */
const crypto = require("crypto");
//const { token } = require("morgan");


const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
        });
        await newUser.save();
        /*
        sendWelcomeEmail({
            email,
            name,
            otp
        }).catch(error => console.error('Welcome email failed:', error));
        */

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: "User not verified, please verify your account" });
        }

        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        //i did'nt add {name: user.name} to the token since it was mentioned not to do so in class unless necessary.

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.jwt_secret, {
            expiresIn: "1h"
        }) 

        /*
        sendLoginNotification({
            name: user.name,
            email: user.email,
            location: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown',
            device: req.headers['user-agent'] || 'Web Browser',
        }).catch(error => console.error('login notification failed:', error));

        */
        //use token to json object to test out the admin permisson point.

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        //otp creation
        const otp = Math.floor(10000 + Math.random() * 90000).toString();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        /*
        sendPasswordResetEmail({
            email: user.email,
            resetToken,
            otp,
            expiryTime: "1 hour"
        }).catch(error => console.error("Password reset email failed:", error));
        */
        return res.status(200).json({ message: "Password reset instructions sent to email", /* otp */ });
    } catch (error) {
        console.error("Error during forget password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const resetPassword = async (req, res) => {
    const { otp, newPassword, token } = req.body;
    try {
        if ((!otp && !token) || !newPassword) {
            return res.status(400).json({ message: "Reset token/OTP and new password are required" });
        }

        let user;
        if (token) {
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
            user = await User.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { $gt: Date.now() }
            });

            if (!user) {
                return res.status(404).json({ message: "Invalid or expired reset token" });
            }
        } else {
            const { email, otp } = req.body;
            user = await User.findOne({ email, otp, otpExpiry: { $gt: Date.now() } });
            if (!user) {
                return res.status(404).json({ message: "invalid OTP" });
            }
        }

        if (otp && user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "otp has expired" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        user.otpExpiry = null;

        await user.save();

        /*
        sendPasswordResetSuccessEmail({
            email: user.email,
            name: user.name,
            location: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown',
        }).catch(error => console.error('Password reset success email failed:', error));
        */

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error during forget password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!otp) {
            return res.status(400).json({ message: "OTP is required" });
        }
        const user = await User.findOne({ email, otp });
        if (!user) {
            return res.status(404).json({ message: "Invalid OTP" });
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP has expired" })
        }
        if (user.isVerified){
            return res.status(400).json({ message: "User already verified" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(200).json({ message: "User verified successfully" })
    }
    catch (error) {
        console.error("Error during OTP verification:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        /*
        resendOtpEmail({
            email: user.email,
            name: user.name,
            otp
        }).catch(error => console.error('Welcome email failed:', error));
        */

        return res.status(200).json({ message: "OTP resent successfully" });
    }
    catch (error) {
        console.error("Error during resending OTP:", error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

const getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied" })
        }
        const users = await User.find().select("name email role createdAt");
        return res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {
    register,
    login,
    forgetPassword,
    resetPassword,
    verifyOtp,
    resendOtp,
    getAllUsers,//admin only.
};