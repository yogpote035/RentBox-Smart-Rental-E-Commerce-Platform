// middlewares/upload.js
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "RentBoxProducts",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;
