import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a base64 image string to Cloudinary.
 * If the image string is not a base64 data URL, returns it as-is.
 * @param {string} imageStr - The image path, URL, or base64 data URL.
 * @param {string} [folder="90drip/products"] - Cloudinary folder.
 * @returns {Promise<string>} The hosted secure URL of the image or original string.
 */
export async function uploadToCloudinary(imageStr, folder = "90drip/products") {
  if (!imageStr) return imageStr;

  // Check if it is a base64 data URL (e.g. data:image/jpeg;base64,...)
  const isBase64 =
    imageStr.startsWith("data:image/") ||
    imageStr.startsWith("data:application/octet-stream");
  if (!isBase64) {
    return imageStr; // It's already a hosted URL or a static relative path
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(imageStr, {
      folder,
      resource_type: "auto",
    });
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
}
