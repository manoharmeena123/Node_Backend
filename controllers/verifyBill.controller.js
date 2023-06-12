const Billing = require("../models/billing");
const { createResponse } = require("../utils/response");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Notification = require("../models/notification");
const getAllBillOfPicker = async (req, res) => {
    try {
        const query = {};
        if (req.query.verifierAssignee) {
            query["verifier.verifierAssignee"] = new ObjectId(
                req.query.verifierAssignee
            );
        }
        if (req.query.status) {
            query["verifier.status"] = req.query.status;
        }

        if (req.query.acceptanceStatus) {
            query["verifier.acceptanceStatus"] = req.query.acceptanceStatus;
        }
        if (req.query.assigned && req.query.assigned === "true") {
            query["verifier.assigned"] = true;
        }
        if (req.query.assigned && req.query.assigned === "false") {
            query["verifier.assigned"] = false;
        }
        const pipeline = [
            {
                $match: query,
            },
            { $sort: { updatedAt: -1 } },
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

const updateBillingPicker = async (req, res) => {
    try {
        const { id } = req.params;

        const billing = await Billing.findById(id);

        const { status, acceptanceStatus, packet, reassign, comment } =
            req.body;
        req.body;
        if (!billing) {
            return res.status(404).json({
                success: false,
                message: "Billing not found",
            });
        }
        const bill = billing.verifier;

        bill.status = status || bill.status;
        bill.acceptanceStatus = acceptanceStatus || bill.acceptanceStatus;
        // bill.packet = packet || bill.packet;
        bill.reassign = reassign || bill.reassign;
        bill.comment = comment || bill.comment;
        // bill.urgencyColor = urgencyColor || bill.urgencyColor;
        await billing.save();
        if (billing.reassign === "Yes") {
            const notification = await Notification.create({
                userId: billing.picker.pickerAssignee,
                title: "Bill Reassigned",
                message: `Bill has been reassigned`,
            });
            billing.picker.reassigned = true;
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
const assignBillToPacker = async (req, res) => {
    const { id } = req.params;
    const { packerId } = req.body;
    try {
        const billing = await Billing.findById(id);
        if (!billing) {
            createResponse(res, 404, "Bill not found");
            return;
        }
        console.log(packerId, " ", billing.packer.packerAssignee);
        billing.packer.packerAssignee = packerId;
        billing.verifier.assigned = true;
        await billing.save();
        const notification = await Notification.create({
            userId: packerId,
            title: "New Bill Assigned",
            message: `You have been assigned a bill`,
        });
        console.log(notification);
        console.log(billing.packer.packerAssignee);
        createResponse(res, 200, "Bill assigned to packer successfully");
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server error");
    }
};

module.exports = {
    updateBillingPicker,
    getAllBillOfPicker,
    assignBillToPacker,
};
