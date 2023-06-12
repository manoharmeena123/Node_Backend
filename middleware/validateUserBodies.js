const User = require("../models/admin");
const createResponse = require("../utils/response");
const isValidEmail = (email) => {
    // checks valid email format
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
const signUp = async (req, res, next) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!isValidEmail(req.body.email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (!req.body.password) {
            return res.status(400).json({ message: "Password is required" });
        }
        if (req.body.password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be atleast 6 characters" });
        }
        if (!req.body.employeeId) {
            return res.status(400).json({ message: "EmployeeId is required" });
        }
        if (!req.body.name) {
            return res.status(400).json({ message: "Name is required" });
        }
        if (!req.body.role) {
            return res.status(400).json({ message: "Role is required" });
        }
        if (!req.body.department) {
            return res.status(400).json({ message: "Department is required" });
        }
        next();
    } catch (err) {
        console.log(err);
        createResponse(res, 400, "server error ", err.message);
    }
};

const updateUser = async (req, res, next) => {
    try {
        if (req.body.employeeId) {
            const employeeId = await User.findOne({
                employeeId: req.body.employeeId,
            });
            if (employeeId) {
                return res.status(409).json({
                    message: `EmployeeId ${req.body.employeeId} already in use`,
                });
            }
        }
        if (req.body.email) {
            if (!isValidEmail(req.body.email)) {
                return res
                    .status(400)
                    .json({ message: "Invalid email format" });
            }

            const email = await User.findOne({
                email: req.body.email,
            });
            if (email) {
                return res.status(409).json({
                    message: `email ${req.body.email} already in use`,
                });
            }
        }
        next();
    } catch (err) {
        console.log(err);
        createResponse(res, 400, "server error ", err.message);
    }
};
const billing = (req, res, next) => {
    const requiredFields = [
        "customerName",
        "billNumber",
        "billingDate",
        "billingAddress",
        "mobile",
        "billAmount",
        "location",
        "mrName",
        "area",
        "route",
        "weight",
        "paymentMode",
        "packing",
        "expectedDelivery",
    ];
    const missingFields = requiredFields.filter(
        (field) => !(field in req.body)
    );
    if (missingFields.length > 1) {
        return res.status(400).json({
            success: false,
            message: ` ${missingFields.join(", ")} are missing`,
        });
    } else if (missingFields.length == 1) {
        return res.status(400).json({
            success: false,
            message: ` ${missingFields.join(", ")} is missing`,
        });
    } else {
        next();
    }
};
const billItemBodies = (req, res, next) => {
    const missingFields = [];
    const requiredFields = [
        "itemName",
        "mrp",
        "batch",
        "expiry",
        "pilotNumber",
        "billId",
    ];
    // Check if each required field is present in the request body
    requiredFields.forEach((field) => {
        if (!req.body[field]) {
            missingFields.push(field);
        }
    });

    // If any fields are missing, return an error response
    if (missingFields.length > 0) {
        const message = ` ${missingFields.join(", ")} cannot be blank.`;
        return res.status(400).json({
            success: false,
            message: message,
        });
    }

    // If all fields are present, continue to the next middleware
    next();
};
const vehicleRequireFields = () => (req, res, next) => {
    const vehicleFields = [
        "userId",
        "vehicleType",
        "model",
        "pollutionCard",
        "insurance",
        "image",
        "registrationCertificate",
        "vehicleNumber",
    ];

    const missingFields = vehicleFields.filter((field) => !(field in req.body));
    if (missingFields.length) {
        return createResponse(
            res,
            400,
            `${missingFields.join(", ")} cannot be blank `
        );
    }
    next();
};

module.exports = {
    signUp,
    updateUser,
    billing,
    billItemBodies,
    vehicleRequireFields,
};
