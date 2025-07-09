import multer from 'multer';
import path from 'path'

const Storage = multer.diskStorage({
    destination: './Profile_Pics_uploads',
    filename: function(req,file,cb) {
        cb(null, file.fieldname + '--' + Date.now() + Math.random().toString(36).substring(2,8) + path.extname(file.originalname))
    }
})


const upload_pic = multer({
    storage:Storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: function(req,file, cb){
        checkFileType(file, cb);
    }

}).single('profile_pic');


function checkFileType(file, cb) {
    // Allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}


export default upload_pic;
