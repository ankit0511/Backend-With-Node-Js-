import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken"

import { User } from "../modles/userModel.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToekn || req.header
            ("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "unothorised request")
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decoded?._id).
            select("-password -refereshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token ")
        }

        req.user = user
        next();
    } catch (error) {
        throw new ApiError(401, "invalid access token ")
    }
})