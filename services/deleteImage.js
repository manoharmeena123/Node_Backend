require("dotenv").config();
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const {
    awsAccessKey,
    awsSecretKey,
    awsBucketName,
    awsRegion,
} = require("../configs/aws.config");
async function deleteImageFromS3(key) {
    try {
        const s3 = new S3Client({
            credentials: {
                accessKeyId: awsAccessKey,
                secretAccessKey: awsSecretKey,
            },
            region: awsRegion, // this is the region that you select in AWS account
        });
        const params = { Bucket: "tollerimages", Key: key.toString() };
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
        // console.log(response);
        console.log(
            `Image with key '${key}' deleted successfully from bucket tollerimages`
        );
    } catch (err) {
        console.log(
            `Error deleting image with key '${key}' from bucket '${awsBucketName}': ${err.message}`
        );
    }
}
module.exports = deleteImageFromS3;
