const User = require("../models/admin"); // Import the User model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret, accessTokenTime } = require("../configs/auth.configs");
const { createResponse } = require("../utils/response");

// Define a signup function that creates a new user document in the database
const signup = async (req, res) => {
    const { email } = req.body;
    try {
        // Check if a user with the given email already exists in the database
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }
        if (req.body.employeeId) {
            const employeeId = await User.findOne({
                employeeId: req.body.employeeId,
            });
            if (employeeId) {
                return res
                    .status(409)
                    .json({ message: "EmployeeId already in use" });
            }
        }
        req.body.password = bcrypt.hashSync(req.body.password, 10);

        // Create a new user document in the database with the given information
        const newUser = new User(req.body);
        await newUser.save();

        // Send a response indicating that the user was successfully created
        return res.status(200).json({
            message: "User created successfully",
            // token: accessToken,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Define a login function that checks the user's credentials and logs them in
const login = async (req, res) => {
    const { employeeId, password, role } = req.body;

    try {
        // Check if a user with the given employeeId exists in the database
        const user = await User.findOne({ employeeId });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (role !== user.role) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        console.log(user.password, password);
        // Check if the password matches the one stored in the database
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, secret, {
            expiresIn: accessTokenTime,
        });
        // Send a response indicating that the user was successfully created
        return res.status(200).json({
            message: "User logged In successfully",
            token: token,
            data: user,
        });
        // If the credentials are valid, send a response indicating that the login was successful
        // return res.status(200).json({ message: "Login successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const getAdmins = async (req, res) => {
    try {
        let query = { ...req.query };

        const admins = await User.find(query).lean();
        if (!admins.length) {
            return res.status(404).json({ message: "admin not found" });
        }
        createResponse(res, 200, "found successfully", admins);
    } catch (err) {
        console.log(err);
        createResponse(res, 400, "server error ", err.message);
    }
};
const updateAdmins = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        const admins = await User.findByIdAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!admins) {
            return res.status(404), json({ message: "Admin not found" });
        }
        res.status(200).json({ message: "Admin updated", data: admins });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAdmin = async (req, res) => {
    try {
        const admins = await User.findById(req.params.id).lean();
        if (!admins) {
            return res.status(404).json({ message: "User not found" });
        }
        createResponse(res, 200, " retrieved successfully", admins);
    } catch (err) {
        console.log(err);
        createResponse(res, 400, "server error ", err.message);
    }
};

const deleteAdmins = async (req, res) => {
    try {
        const admins = await User.findByIdAndDelete(req.params.id);
        if (!admins) {
            return res.status(404).json({ message: "User not found" });
        }
        createResponse(res, 200, "admins retrieved successfully", admins);
    } catch (err) {
        console.log(err);
        createResponse(res, 400, "server error ", err.message);
    }
};

module.exports = {
    signup,
    login,
    getAdmin,
    getAdmins,
    deleteAdmins,
    updateAdmins,
};
