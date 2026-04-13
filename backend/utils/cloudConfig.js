const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const cloudinaryStorageModule = require("multer-storage-cloudinary");
const CloudinaryStorage =
  cloudinaryStorageModule.CloudinaryStorage || cloudinaryStorageModule;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "library_books",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
});

// Multer upload
const upload = multer({ storage });

module.exports = { upload, cloudinary };