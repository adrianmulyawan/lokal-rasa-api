import multer, { Multer, FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { RequestHandler } from 'express';

// Create a directory if it doesn't exist
const createDirectoryIfNotExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage configuration for multiple files
const storageMultiple = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = 'public/images';
    createDirectoryIfNotExists(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer configuration for multiple files
const uploadMultiple: RequestHandler = multer({
  storage: storageMultiple,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb: FileFilterCallback) => {
    checkFileType(file, cb);
  },
}).array('image', 12);

// Storage configuration for a single file
const storage = multer.diskStorage({
  destination: 'public/images',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer configuration for a single file
const upload: RequestHandler = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb: FileFilterCallback) => {
    checkFileType(file, cb);
  },
}).single('image');

// Check file type
function checkFileType(file: Express.Multer.File, cb: FileFilterCallback) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only !!!'));
  }
}

export { uploadMultiple, upload };
