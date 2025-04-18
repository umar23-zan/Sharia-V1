const AWS = require('aws-sdk');
require('dotenv').config(); 

// Configure AWS S3
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// S3 Upload Function
const uploadToS3 = async (file, email) => {
    const fileExtension = require('path').extname(file.originalname);
    const key = `profilePictures/${email}-${Date.now()}${fileExtension}`;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        
    };

    try {
        const result = await s3.upload(params).promise();
        return result.Location;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
};


// S3 Delete Function
const deleteFromS3 = async (fileUrl) => {
    try {
       
        const key = fileUrl.split('/').slice(-2).join('/'); 
        
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key
        };

        await s3.deleteObject(params).promise();
        return true;
    } catch (error) {
        console.error('Error deleting from S3:', error);
        throw new Error('Failed to delete file from S3');
    }
};

// Get S3 File Function
const getS3File = async (key) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key
    };

    try {
        const data = await s3.getObject(params).promise();
        return data;
    } catch (error) {
        console.error('Error getting file from S3:', error);
        throw new Error('Failed to get file from S3');
    }
};

// Generate Presigned URL
const generatePresignedUrl = async (key, expirationInSeconds = 3600) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Expires: expirationInSeconds
    };

    try {
        const url = await s3.getSignedUrlPromise('getObject', params);
        return url;
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        throw new Error('Failed to generate presigned URL');
    }
};

module.exports = {
    s3,
    uploadToS3,
    deleteFromS3,
    getS3File,
    generatePresignedUrl
};
