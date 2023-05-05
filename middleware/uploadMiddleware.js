const multer =  require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb)=>{
        cb(null, file.fieldname + '-'+ Date.now()+ file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*1
    },
    fileFilter: (req, file, cb)=>{
        const type = /jpeg|jpg|png|gif/;
        const extName = type.test(path.extname(file.originalname).toLowerCase());
        const mimeType = type.test(file.mimetype);

        if(extName && mimeType){
            cb(null, true)
        }
        else{
            cb(new Error('Only support image'))
        }
    }
})

module.exports = upload;
