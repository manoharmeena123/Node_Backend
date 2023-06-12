require("dotenv").config();
module.exports = {
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_KEY,
    awsBucketName: process.env.AWS_BUCKET_NAME,
    awsRegion: process.env.AWS_REGION,
};
