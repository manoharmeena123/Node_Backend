const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

// create s3 instance using S3Client
// (this is how we create s3 instance in v3)
const s3 = new S3Client({
    credentials: {
        accessKeyId: "AKIAYWJWRO2ITUJL4R5J",
        secretAccessKey: "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",
        // accessKeyId: "AKIASRY3AQTBAV37WSW7",
        // secretAccessKey: "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",
    },
    region: "ap-south-1", // this is the region that you select in AWS account
});
const s3Storage = multerS3({
    s3: s3, // s3 instance
    bucket: "tollerimages", // change it as per your project requirement
    acl: "public-read", // storage access type
    metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname });
    },
    key: (req, file, cb) => {
        const fileName =
            Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    },
});
function sanitizeFile(file, cb) {
    // Define the allowed extension
    const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

    // Check allowed extensions
    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    // Mime type must be an image
    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true); // no errors
    } else {
        // pass error msg to callback, which can be displaye in frontend
        cb("Error: File type not allowed!");
    }
}

// our middleware
const uploadImage = multer({
    storage: s3Storage,
    ContentType: "image/jpeg" || "image/png" || "image/jpg",
    acl: "public-read",
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback);
    },
    limits: {
        fileSize: 1024 * 1024 * 10, // 10mb file size
    },
});

module.exports = uploadImage;
