const express = require("express");
const isAuth = require("../middleware/auth-midware");
const { register, login, forgetPassword, resetPassword, verifyOtp, resendOtp, getAllUsers} = require("../controller/auth-controllers");

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.put("/forget-password", forgetPassword);
router.put("/reset-password", resetPassword);
router.put("/verify-otp", verifyOtp);
router.put("/resend-otp", resendOtp);
router.get("/users", isAuth, getAllUsers);


module.exports = router;