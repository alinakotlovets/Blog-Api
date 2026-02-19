import jwt from "jsonwebtoken";
export function getIndexPageInfo(req, res){
    if(req.user){
        return res.status(200).json({
            message: "You on Home page!",
            user: req.user
        })
    } else {
        return res.status(200).json({message: "You on Home page!"})
    }
}