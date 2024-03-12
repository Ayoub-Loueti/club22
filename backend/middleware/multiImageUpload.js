const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload for multiple files
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // Increase limit for video file size
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).array('photos', 5); // 'photos' is the name of our file field in the form, limit to 5 files

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|mp4/; // Add mp4 for video files
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images and videos Only!');
  }
}

module.exports = upload;
