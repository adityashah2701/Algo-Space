// utils/cloudinary.js
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        const defaultOptions = {
            folder: "images",
            resource: "auto",
            chunk_size: 6000000 
        };
        
        const uploadOptions = { ...defaultOptions, ...options };
        
        const result = await cloudinary.uploader.upload(filePath, uploadOptions);
        return result.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Error uploading file to Cloudinary");
    }
};


export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
        throw new Error("Error deleting file from Cloudinary");
    }
};


export const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    
    try {
       
        const urlParts = url.split('/');
        
      
        const publicIdWithExtension = urlParts.slice(urlParts.findIndex(part => part.match(/^v\d+/)) + 1).join('/');
        
        // Remove file extension
        return publicIdWithExtension.split('.')[0];
    } catch (error) {
        console.error("Error extracting public ID:", error);
        return null;
    }
};