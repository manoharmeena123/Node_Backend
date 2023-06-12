const Faq = require("../models/faq");
const { createResponse } = require("../utils/response");

// Get all FAQs
const getAllFaqs = async (req, res) => {
    try {
        let query = {};
        if (req.query.category) {
            query = { category: req.query.category };
        }
        const faqs = await Faq.find(query)
            .lean()
            .select({ _id: 1, question: 1, answer: 1 });
        return createResponse(res, 200, " faqs retrieved successfully", faqs);
    } catch (err) {
        console.log(err);
        return createResponse(res, 500, "Error", err.message);
    }
};

// Get a specific FAQ by ID
const getFaqById = async (req, res) => {
    const { id } = req.params;
    try {
        const faq = await Faq.findById(id);
        if (!faq) {
            return createResponse(res, 404, "Not Found");
        }
        return createResponse(res, 200, "faqs retrieved successfully", faq);
    } catch (err) {
        console.log(err);
        return createResponse(res, 500, "Error", err.message);
    }
};

// Create a new FAQ
const createFaq = async (req, res) => {
    const { question, answer } = req.body;
    try {
        if (!question || !answer) {
            return createResponse(
                res,
                400,
                "questions and answers cannot be blank"
            );
        }
        const faq = await Faq.create(req.body);
        return createResponse(res, 201, "FAQ Added Successfully", faq);
    } catch (err) {
        console.log(err);
        return createResponse(res, 500, "Error", err.message);
    }
};

// Update an existing FAQ by ID
const updateFaq = async (req, res) => {
    const { id } = req.params;
    //     const { question, answer } = req.body;
    try {
        const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
        if (!faq) {
            return createResponse(res, 404, "Not Found");
        }
        return createResponse(res, 200, "FAQ Updated Successfully", faq);
    } catch (err) {
        console.log(err);
        return createResponse(res, 500, "Something went wrong", err.message);
    }
};

// Delete an existing FAQ by ID
const deleteFaq = async (req, res) => {
    const { id } = req.params;
    try {
        const faq = await Faq.findByIdAndDelete(id);
        if (!faq) {
            return createResponse(res, 404, "Not Found");
        }
        return createResponse(res, 200, "FAQ Deleted Successfully", faq);
    } catch (err) {
        console.log(err);
        return createResponse(res, 500, "Something went wrong", err.message);
    }
};

module.exports = {
    getAllFaqs,
    getFaqById,
    createFaq,
    updateFaq,
    deleteFaq,
};
