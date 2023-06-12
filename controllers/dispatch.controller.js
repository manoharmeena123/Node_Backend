const Billing = require("../models/billing");
const { createResponse } = require("../utils/response");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getAllBillOfDispatch = async (req, res) => {
    try {
        const query = {};
        if (req.query.mrName) {
            query.mrName = req.query.mrName;
        }
        if (req.query.area) {
            query.area = req.query.area;
        }
        if (req.query.route) {
            query.route = req.query.route;
        }
        if (req.query.dispatchStatus) {
            query.dispatch.status = req.query.dispatchStatus;
        }
        if (req.query.acceptanceStatus) {
            query.dispatch.acceptanceStatus = req.query.acceptanceStatus;
        }
        if (req.query.dispatchAssignee) {
            query["dispatch.dispatchAssignee"] = new ObjectId(
                req.query.dispatchAssignee
            );
        }
        if (req.query.assigned && req.query.assigned === "true") {
            query["dispatch.assigned"] = true;
        }
        if (req.query.assigned && req.query.assigned === "false") {
            query["dispatch.assigned"] = false;
        }

        const pipeline = [
            {
                $match: query,
            },
            {
                $sort: {
                    updatedAt: -1,
                },
            },
            {
                $lookup: {
                    from: "billitems",
                    localField: "billItems",
                    foreignField: "_id",
                    as: "billItems",
                },
            },
            // {
            //     $project: {
            //         _id: 1,
            //         billingDate: 1,
            //         totalAmount: 1,
            //         picker: {
            //             pickerAssignee: 1,
            //         },
            //         billItems: {
            //             _id: 1,
            //             itemName: 1,
            //             itemPrice: 1,
            //         },
            //     },
            // },
        ];
        const billings = await Billing.aggregate(pipeline);
        if (!billings || billings.length === 0) {
            createResponse(res, 404, "No bills found");
            return;
        }
        createResponse(res, 200, "All bills fetched successfully", billings);
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server error");
    }
};

const updateBillingDispatch = async (req, res) => {
    try {
        const { id } = req.params;

        const billing = await Billing.findById(id);

        const {
            status,
            acceptanceStatus,
            boxQuantity,
            polyPackQuantity,
            reassign,
            comment,
        } = req.body;
        req.body;
        if (!billing) {
            return res.status(404).json({
                success: false,
                message: "Billing not found",
            });
        }
        const bill = billing.dispatch;

        bill.status = status || bill.status;
        bill.acceptanceStatus = acceptanceStatus || bill.acceptanceStatus;
        bill.boxQuantity = boxQuantity || bill.boxQuantity;
        bill.reassign = reassign || bill.reassign;
        bill.comment = comment || bill.comment;
        bill.polyPackQuantity = polyPackQuantity || bill.polyPackQuantity;
        await billing.save();
        if (billing.reassign === "Yes") {
            const notification = await Notification.create({
                userId: billing.packer.packerAssignee,
                title: "Bill Reassigned",
                message: `Bill has been reassigned`,
            });
            console.log(notification);
            billing.packer.reassigned = true;
            await billing.save();
        }
        return res.status(200).json({
            success: true,
            message: "Billing updated successfully",
            data: billing,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
const assignBillToDispatch = async (req, res) => {
    const { id } = req.params;
    const { dispatchId } = req.body;
    try {
        const billing = await Billing.findById(id);
        if (!billing) {
            createResponse(res, 404, "Bill not found");
            return;
        }
        console.log(dispatchId, " ", billing.dispatch.dispatchAssignee);
        billing.dispatch.dispatchAssignee = dispatchId;
        await billing.save();
        console.log(billing.dispatch.dispatchAssignee);
        createResponse(res, 200, "Bill assigned to dispatch successfully");
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server error");
    }
};

module.exports = {
    updateBillingDispatch,
    getAllBillOfDispatch,
    assignBillToDispatch,
};
