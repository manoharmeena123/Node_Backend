const BillItems = require("../models/billItem");
const Billing = require("../models/billing");
const createResponse = (res, statusCode, message = "", data = null) => {
    const status = statusCode >= 200 && statusCode < 300 ? true : false;
    return res.status(statusCode).json({
        success: status,
        message: message,
        data: data,
    });
};
//get all bill items
const getAllBillItems = async (req, res) => {
    try {
        const billItems = await BillItems.find({ ...req.query }).lean();
        createResponse(res, 200, "Bill items found", billItems);
    } catch (err) {
        console.log(err);
        createResponse(res, 404, "Bill items not found", err.message);
    }
};
// CREATE - POST /billitems
const createBillItem = async (req, res) => {
    try {
        const billing = await Billing.findById(req.body.billId);
        if (!billing) {
            return createResponse(res, 404, "Billing not found");
        }

        const billItem = new BillItems(req.body);
        const savedBillItem = await billItem.save();
        billing.billItems.push(savedBillItem._id);
        await billing.save();
        createResponse(
            res,
            201,
            "Bill item created successfully",
            savedBillItem
        );
    } catch (err) {
        console.log(err);
        createResponse(res, 400, "Failed to create bill item", err.message);
    }
};

// READ - GET /billitems/:id
const getBillItem = async (req, res) => {
    try {
        const billItemId = req.params.id;
        const billItem = await BillItems.findById(billItemId);
        if (!billItem) {
            return createResponse(res, 404, "Bill item not found");
        }
        createResponse(res, 200, "Bill item found", billItem);
    } catch (err) {
        console.log(err);
        createResponse(res, 404, "Bill item not found", err.message);
    }
};

// UPDATE - PUT /billitems/:id
const updateBillItem = async (req, res) => {
    try {
        const billItemId = req.params.id;
        const updates = req.body;
        const options = { new: true };
        const updatedBillItem = await BillItems.findByIdAndUpdate(
            billItemId,
            updates,
            options
        );
        createResponse(
            res,
            200,
            "Bill item updated successfully",
            updatedBillItem
        );
    } catch (err) {
        console.log(err);
        createResponse(res, 400, "Failed to update bill item", err.message);
    }
};

// DELETE - DELETE /billitems/:id
const deleteBillItem = async (req, res) => {
    try {
        const billItemId = req.params.id;
        await BillItems.findByIdAndDelete(billItemId);
        createResponse(res, 200, "Bill item deleted successfully");
    } catch (err) {
        console.log(err);
        createResponse(res, 400, "Failed to delete bill item", err.message);
    }
};

module.exports = {
    createBillItem,
    getBillItem,
    updateBillItem,
    deleteBillItem,
    getAllBillItems,
};
