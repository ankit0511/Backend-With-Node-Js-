import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken"

import { User } from "../modles/userModel.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
     
        
        const token = req.cookies?.accessToken;
              
      
            
        if (!token) {
            throw new ApiError(401, "unothorised request")
        }
     

        const decoded = jwt.verify(token, "1234")

      

        const user = await User.findById(decoded?._id).
            select("-password -refereshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access  Token found  ")
        }

        req.user = user
        next();
    } catch (error) {
        throw new ApiError(401, error?.message|| "invalid access token ")
    }
})