// AWS configuration
const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-access-key-id',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-access-key',
  bucketName: process.env.S3_BUCKET_NAME || 'chat-media-bucket'
};

module.exports = awsConfig;
