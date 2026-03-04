import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {getUserByUsername} from "../lib/queries.js";
import {body, matchedData, validationResult} from "express-validator";

export const validateUser = [
    body("username")
        .trim()
        .notEmpty().withMessage("username is required")
        .isLength({min: 3}).withMessage("username should be at least 3 symbols")
        .isLength({max:30}).withMessage("username should be no more than 30 symbols"),
    body("password")
        .trim()
        .notEmpty().withMessage("password is required")
        .isLength({min: 8}).withMessage("password should be at least 8 symbols")
        .isLength({max:30}).withMessage("password should be no more than 30 symbols")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/).withMessage("Password must contain at least one number")
]

export async function postSignIn(req, res){
     const errors = validationResult(req);
     if(!errors.isEmpty()){
      return res.status(400).json({
          errors: errors.array()
      })
     }

     const {username, password} = matchedData(req);

     const user = await getUserByUsername(username);
     if(!user){
         return  res.status(404).json(
             {
             errors: [{msg: "User with this username not found"}],
         })
     }

     const match = await bcrypt.compare(password, user.password);
     if(match){
         jwt.sign({userId: user.id, username:user.username, role: user.role}, process.env.SECRET_KEY, {expiresIn: "1d"} ,(err, token)=>{
             if(err) return res.status(500).json({errors: [{msg: "Server error"}]});

             return res.status(200).json({
                 token: token
             })
         })

     } else{
         return  res.status(401).json({
                 errors: [{msg: "Password incorrect"}],
             })
     }
}