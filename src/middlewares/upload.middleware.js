const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder;
        if (file.mimetype.startsWith('image/')) {
            folder = 'uploads/images/';
        } else if (file.mimetype.startsWith('audio/')) {
            folder = 'uploads/sounds/';
        } else {
            return cb(new Error('Invalid file type.'));
        }
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

module.exports = upload;
