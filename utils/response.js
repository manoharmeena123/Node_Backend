const createResponse = (res, statusCode, message = "", data = null) => {
    const status = statusCode >= 200 && statusCode < 300 ? true : false;
    return res.status(statusCode).json({
        success: status,
        message: message,
        data: data,
    });
};
module.exports = { createResponse };
