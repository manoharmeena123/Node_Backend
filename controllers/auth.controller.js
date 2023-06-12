const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret, accessTokenTime } = require("../configs/auth.configs");
const User = require("../models/user");
const otpService = require("../services/otp");
const { createResponse } = require("../utils/response");

// Define a signup function that creates a new user document in the database
exports.signup = async (req, res) => {
    try {
        // Check if a user with the given email already exists in the database
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return createResponse(res, 409, "Email address already in use");
        }
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        // const existingPhone = await User.findOne({ phone });
        // if (existingPhone) {
        //     return createResponse(
        //         res,
        //         409,
        //         " Mobile Number address already in use"
        //     );
        // }
        // Create a new user document in the database with the given information
        const token = Math.floor(Math.random() * 9000) + 999;
        req.body.otp = token;
        const newUser = new User(req.body);

        await newUser.save();

        console.log("User created", newUser);
        // Send a response indicating that the user was successfully created
        return createResponse(res, 201, "User created successfully", {
            user: newUser,
            otp: token,
        });
    } catch (err) {
        console.error(err);
        return createResponse(res, 500, "Internal server error");
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return createResponse(res, 404, "User not found");
        }
        if (user.otp !== otp) {
            return createResponse(res, 401, "Invalid OTP");
        }
        user.otp = null;
        user.mobileVerified = true;
        await user.save();
        return createResponse(res, 200, " verified successfully");
    } catch (err) {
        console.error(err);
        return createResponse(res, 500, "Internal server error");
    }
};

// Define a login function that checks the user's credentials and sends an OTP for authentication
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if a user with the given email exists in the database
        const user = await User.findOne({ email });

        if (!user) {
            return createResponse(res, 401, "Invalid credentials");
        }
        // Check if the password matches the one stored in the database
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return createResponse(res, 401, "Invalid credentials");
        }
        const accessToken = jwt.sign({ id: user._id }, secret, {
            expiresIn: accessTokenTime,
        });
        // Generate a new OTP and send it to the user's phone number

        return createResponse(res, 200, "logged In  successfully", {
            accessToken,user
        });
    } catch (err) {
        console.error(err);
        return createResponse(res, 500, "Internal server error");
    }
};
require("dotenv").config();
const nodemailer = require("nodemailer");
exports.forgotPassword = async (req, res) => {
    try {
        // Extract email from request body
        const { email } = req.body;

        // Generate a password reset token and save it to the user's document in the database
        const token = Math.floor(Math.random() * 9000) + 999;
        console.log(token);
        const user = await User.findOneAndUpdate(
            { email },
            {
                resetPasswordToken: token,
                resetPasswordExpires: Date.now() + 3600000,
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a nodemailer transporter object
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "node2@flyweis.technology",
                pass: "ayesha@9818#",
            },
        });

        // Define the email options
        const mailOptions = {
            to: email,
            from: "node2@flyweis.technology",
            subject: "Password reset request",
            text:
                `OTP ${token}\n` +
                `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `your otp is ${token} ` +
                `for reset password\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        // Send the email with nodemailer
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Could not send email. Please try again later.",
                });
            }
            res.status(200).json({
                message: "Password reset email sent successfully",
                otp: token,
                userId: user._id,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};
exports.forgotPasswordOtp = async (req, res) => {
    try {
        const id = req.params.id;
        const otp = req.body.otp;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        if (user.resetPasswordToken !== otp) {
            return res.status(403).json({
                message: "Wrong otp",
            });
        }
        res.status(200).json({ message: "otp verification is successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
exports.resetPassword = async (req, res) => {
    try {
        // Extract password and confirm password from request body
        const { password, confirmPassword } = req.body;

        // Verify that passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Find user with valid password reset token
        const user = await User.findOne({
            _id: req.params.id,
        });

        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid or expired token" });
        }

        // Update user's password and clear the reset token
        user.password = bcrypt.hashSync(password, 10);

        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred. Please try again later.",
        });
    }
};
