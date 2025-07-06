const express = require("express");
const router = express.Router();
const { localFileupload, imageUpload, uploadProductImage, deleteImage } = require("../controllers/fileupload")

router.post("/localFileUpload", localFileupload);
router.post("/imageUpload", imageUpload);
router.post("/uploadProductImage", uploadProductImage);
router.delete("/deleteImage", deleteImage);

module.exports = router;
