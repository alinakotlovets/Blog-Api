import jwt from "jsonwebtoken";

export function verifyToken(req, res, next){
    const bearerHeader = req.headers["authorization"];
    if(!bearerHeader){
        req.user = null;
        return next();
    }
    const token = bearerHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, authData)=> {
        if (err) {
            req.user = null;
        } else {
            req.user = authData;
        }
        next();
    });

}