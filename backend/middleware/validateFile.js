export function validateFile(req, res, next) {
    const { file } = req;
    const maxSize = 5 * 1024 * 1024;
    const errors = [];

    if(file){
        if(!file.mimetype.startsWith("image/")){
            errors.push({msg: "Type of file is not supported. Only images are allowed"});
        }
        if (file.size > maxSize){
            errors.push({msg: "Size of file too big (max 5MB)"});
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({errors});
    }

    next();
}