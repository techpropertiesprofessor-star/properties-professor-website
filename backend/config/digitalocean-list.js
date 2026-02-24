const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { s3Client } = require('./digitalocean');
const DO_SPACES_BUCKET = 'properties-media';

/**
 * List all file keys in a folder in DigitalOcean Spaces
 * @param {string} folder
 * @returns {Promise<string[]>}
 */
async function listKeysInFolder(folder) {
  const command = new ListObjectsV2Command({
    Bucket: DO_SPACES_BUCKET,
    Prefix: folder.endsWith('/') ? folder : folder + '/',
  });
  const result = await s3Client.send(command);
  return (result.Contents || []).map(obj => obj.Key);
}

module.exports = { listKeysInFolder };
