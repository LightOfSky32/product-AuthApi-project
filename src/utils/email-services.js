const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

transporter.verify((error, success) =>{
    if (error) {
        console.error("Email transporter verification failed:", error);
    } else {
        console.log("Email service is ready to send messages")
    }
});

const sendWelcomeEmail = async ({email, name, otp}) => {
    try{
        const templatePath = path.join(__dirname, "../../template/welcome-email.ejs");
        const html = await ejs.renderFile(templatePath, {name, email, otp});

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to TechyJaunt Academy!",
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error){
        console.error("Failed to send welcome email:", error);
        throw error
    }
};

const sendLoginNotification = async({ name, email, location, device, }) => {
    try {
        const templatePath = path.join(__dirname, "../../template/login-notifs.ejs");
        const html = await ejs.renderFile(templatePath, {
            name,
            email,
            location,
            device
        });

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME } <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "New Login Detected - Security Alert",
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(" Login notification sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Failed to send login notification:", error);
        throw error;
    }
};

const sendPasswordResetEmail = async ({ email, name, resetToken, otp, expiryTime }) => {
    try {
        const templatePath = path.join(__dirname, "../../template/forgot-password.ejs");
        const html = await ejs.renderFile(templatePath, {
            name,
            email,
            resetToken,
            otp,
            expiryTime
        });

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Request - Action Required",
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw error;
    }
};

const sendPasswordResetSuccessEmail = async ({ email, name, location }) => {
    try {
        const templatePath = path.join(__dirname, "../../template/password-reset-success.ejs");
        const html = await ejs.renderFile(templatePath, {
            name,
            email,
            location
        });

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset sucessful",
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(" Password reset success email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Failed to send password reset success email:", error);
        throw error;
    }
};

const resendOtpEmail = async ({ email, name, otp }) => {
    try {
        const templatePath = path.join(__dirname, "../../template/resend-otp.ejs");
        const html = await ejs.renderFile(templatePath, {
            name,
            email,
            otp,
        });

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Resend Otp",
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Otp resend email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Failed to resend otp email:", error);
        throw error;
    }
};


module.exports = {
    sendWelcomeEmail,
    sendLoginNotification,
    sendPasswordResetEmail,
    sendPasswordResetSuccessEmail,
    resendOtpEmail
}