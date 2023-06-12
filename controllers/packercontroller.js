const Billing = require("../models/billing");
const { createResponse } = require("../utils/response");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Notification = require("../models/notification");
const getAllBillOfPacker = async (req, res) => {
    try {
        const query = {};
        if (req.query.packerAssignee) {
            query["packer.packerAssignee"] = new ObjectId(
                req.query.packerAssignee
            );
        }
        if (req.query.assigned && req.query.assigned === "true") {
            query["packer.assigned"] = true;
        }
        if (req.query.assigned && req.query.assigned === "false") {
            query["packer.assigned"] = false;
        }

        if (req.query.status) {
            query["packer.status"] = req.query.status;
        }
        if (req.query.acceptanceStatus) {
            query["packer.acceptanceStatus"] = req.query.acceptanceStatus;
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

const updateBillingPacker = async (req, res) => {
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
        const bill = billing.packer;

        bill.status = status || bill.status;
        bill.acceptanceStatus = acceptanceStatus || bill.acceptanceStatus;
        bill.packet = packet || bill.packet;
        bill.reassign = reassign || bill.reassign;
        bill.comment = comment || bill.comment;
        // bill.urgencyColor = urgencyColor || bill.urgencyColor;
        await billing.save();
        if (billing.reassign === "Yes") {
            const notification = await Notification.create({
                userId: billing.verifier.verifierAssignee,
                title: "Bill Reassigned",
                message: `Bill has been reassigned`,
            });
            console.log(notification);
            billing.verifier.reassigned = true;
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
        billing.packer.assigned = true;
        await billing.save();
        const notification = await Notification.create({
            userId: dispatchId,
            title: "New Bill Assigned",
            message: `You have been assigned a bill`,
        });
        console.log(notification);
        console.log(billing.dispatch.dispatchAssignee);
        createResponse(res, 200, "Bill assigned for dispatch successfully");
    } catch (error) {
        console.log(error);
        createResponse(res, 500, "Server error");
    }
};

module.exports = {
    updateBillingPacker,
    getAllBillOfPacker,
    assignBillToDispatch,
};
