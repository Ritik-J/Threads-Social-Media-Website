import User from "../Model/userModel.js";
import jwt from "jsonwebtoken"

export const protectRoute = async(req, res, next) => {
try {
    const token = req.cookies.jwt;

    //checking if the user is logged in or does not have account 
    if (!token) {
        return res.status(401).json({message : "unauthorized"})
    }

    //if the user logged in then decoding jwt token to verify 

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    
    //finding the user and return only user id not password 

    const user = await User.findById(decode.userId).select("-password")

    req.user = user

    next();

} catch (error) {
    res.status(404).json({message : error.message})
    console.log("error in protectRoute: ", error.message);
}
}