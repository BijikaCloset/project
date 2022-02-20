express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const path = require("path");
const url = require("url");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// const s3 = new aws.S3({
//   accessKeyId: "AKIATIVRR6GQMLPBJHPQ",
//   secretAccessKey: "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",
//   Bucket: "bijikaproducts",
//   region: "us-east-2",
// });

// function checkFileType(file, cb) {
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);
//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only!");
//   }
// }

// const fileUpload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "bijikaproducts",
//     acl: "bucket-owner-full-control",
//     key: function (req, file, cb) {

//       cb(
//         null,
//         path.basename(file.originalname, path.extname(file.originalname)) +
//           "-" +
//           Date.now() +
//           path.extname(file.originalname)
//       );
//     },
//   }),
//   limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// });

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "server/uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : alert("Invalide file type");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
