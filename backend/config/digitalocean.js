const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// DigitalOcean Spaces Configuration
const DO_SPACES_ENDPOINT = 'https://sgp1.digitaloceanspaces.com';
const DO_SPACES_REGION = 'sgp1';
const DO_SPACES_BUCKET = 'properties-media';
const DO_SPACES_KEY = process.env.DO_SPACES_KEY || 'DO801LLAH64YHPRDY8L3';
const DO_SPACES_SECRET = process.env.DO_SPACES_SECRET || 'RZGt2xfz8zTcCDKXTMU5ubLvrc82H5HmdCD2jVt9oxQ';

// CDN URL for faster delivery
const DO_SPACES_CDN_URL = `https://${DO_SPACES_BUCKET}.${DO_SPACES_REGION}.cdn.digitaloceanspaces.com`;

// Initialize S3 Client for DigitalOcean Spaces
const s3Client = new S3Client({
  endpoint: DO_SPACES_ENDPOINT,
  region: DO_SPACES_REGION,
  credentials: {
    accessKeyId: DO_SPACES_KEY,
    secretAccessKey: DO_SPACES_SECRET,
  },
  forcePathStyle: false, // Required for DigitalOcean Spaces
});

/**
 * Upload a file to DigitalOcean Spaces
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} originalName - Original filename
 * @param {string} folder - Folder path in bucket (e.g., 'properties', 'news', 'testimonials')
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<{url: string, key: string}>}
 */
async function uploadToSpaces(fileBuffer, originalName, folder = 'general', contentType = 'application/octet-stream') {
  const ext = path.extname(originalName).toLowerCase();
  const uniqueId = uuidv4();
  const key = `${folder}/${uniqueId}${ext}`;

  const command = new PutObjectCommand({
    Bucket: DO_SPACES_BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: 'public-read', // Make files publicly accessible
    CacheControl: 'max-age=31536000', // Cache for 1 year
  });

  await s3Client.send(command);

  return {
    url: `${DO_SPACES_CDN_URL}/${key}`,
    key: key,
  };
}

/**
 * Upload multiple files to DigitalOcean Spaces
 * @param {Array<{buffer: Buffer, originalName: string, mimeType: string}>} files 
 * @param {string} folder 
 * @returns {Promise<Array<{url: string, key: string}>>}
 */
async function uploadMultipleToSpaces(files, folder = 'general') {
  const uploadPromises = files.map(file => 
    uploadToSpaces(file.buffer, file.originalName, folder, file.mimeType)
  );
  return Promise.all(uploadPromises);
}

/**
 * Delete a file from DigitalOcean Spaces
 * @param {string} key - File key in bucket
 * @returns {Promise<boolean>}
 */
async function deleteFromSpaces(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: DO_SPACES_BUCKET,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting from Spaces:', error);
    return false;
  }
}

/**
 * Delete multiple files from DigitalOcean Spaces
 * @param {Array<string>} keys 
 * @returns {Promise<Array<boolean>>}
 */
async function deleteMultipleFromSpaces(keys) {
  const deletePromises = keys.map(key => deleteFromSpaces(key));
  return Promise.all(deletePromises);
}

/**
 * Get a signed URL for temporary private access
 * @param {string} key 
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>}
 */
async function getSignedUrlForFile(key, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: DO_SPACES_BUCKET,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Extract the key from a full URL
 * @param {string} url 
 * @returns {string|null}
 */
function extractKeyFromUrl(url) {
  if (!url) return null;
  
  // Handle CDN URL
  if (url.includes('.cdn.digitaloceanspaces.com')) {
    const match = url.match(/cdn\.digitaloceanspaces\.com\/(.+)$/);
    return match ? match[1] : null;
  }
  
  // Handle direct Spaces URL
  if (url.includes('.digitaloceanspaces.com')) {
    const match = url.match(/\.digitaloceanspaces\.com\/(.+)$/);
    return match ? match[1] : null;
  }
  
  return null;
}

/**
 * Get file info for validation
 * @param {string} mimeType 
 * @returns {{isValid: boolean, type: 'image'|'video'|'document'|'unknown', maxSize: number}}
 */
function getFileTypeInfo(mimeType) {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  const documentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  if (imageTypes.includes(mimeType)) {
    return { isValid: true, type: 'image', maxSize: 10 * 1024 * 1024 }; // 10MB for images
  }
  if (videoTypes.includes(mimeType)) {
    return { isValid: true, type: 'video', maxSize: 500 * 1024 * 1024 }; // 500MB for videos
  }
  if (documentTypes.includes(mimeType)) {
    return { isValid: true, type: 'document', maxSize: 20 * 1024 * 1024 }; // 20MB for documents
  }
  
  return { isValid: false, type: 'unknown', maxSize: 0 };
}

module.exports = {
  s3Client,
  uploadToSpaces,
  uploadMultipleToSpaces,
  deleteFromSpaces,
  deleteMultipleFromSpaces,
  getSignedUrlForFile,
  extractKeyFromUrl,
  getFileTypeInfo,
  DO_SPACES_CDN_URL,
  DO_SPACES_BUCKET,
};
