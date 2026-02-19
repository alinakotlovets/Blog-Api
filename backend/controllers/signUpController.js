import bcrypt from "bcryptjs"
import {addUserToBd} from "../lib/queries.js";
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
        .matches(/[0-9]/).withMessage("Password must contain at least one number"),
    body("confirmPassword")
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
]

export async function addUser(req, res){
    const  errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array(),
            username: req.body.username,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        })
    }

    const {username, password, confirmPassword} = matchedData(req);
    const hashedPassword = await bcrypt.hash(password, 10);
    await addUserToBd(username, hashedPassword);
    res.status(200).json({
        message:"user added successfully",
        redirectTo: "sign-in.html"
    })
}