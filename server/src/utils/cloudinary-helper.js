import cloudinary from '../config/cloudinary.js';

/**
 * Extracts the public ID from a Cloudinary URL.
 * @param {string} url - The Cloudinary URL.
 * @returns {string|null} - The public ID or null.
 */
const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  
  // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v123456789/folder/public_id.jpg
  // We need everything after /upload/ (excluding the version part v123456789/)
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    const afterUpload = parts[1];
    const pathParts = afterUpload.split('/');
    
    // If the first part starts with 'v' followed by digits, it's the version part
    const startIndex = (pathParts[0].match(/^v\d+$/)) ? 1 : 0;
    
    const publicIdWithExt = pathParts.slice(startIndex).join('/');
    const publicId = publicIdWithExt.split('.')[0]; // remove extension
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

/**
 * Uploads a base64 image or a file path to Cloudinary.
 * @param {string} file - The file to upload (base64 string or path).
 * @param {string} folder - The folder to upload to.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
export const uploadToCloudinary = async (file, folder = 'print_emporium') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Deletes an asset from Cloudinary using its URL.
 * @param {string} url - The secure URL of the asset to delete.
 */
export const deleteFromCloudinary = async (url) => {
  try {
    const publicId = getPublicIdFromUrl(url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted from Cloudinary: ${publicId}`);
    }
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    // We don't necessarily want to throw here to prevent breaking the main flow
    // but we log it.
  }
};
