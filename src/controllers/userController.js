import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { User } from "../modles/userModel.js"

import { uploadFilesOnCloudiney } from "../utils/cloudinery.js"
const registerUser = asyncHandler(async (req, res) => {

    /* to register user we have to follow followinf steps 
    1. Get the data of users from database 
    2. All Possible Validation 
    3. Check if user alrady exists 
    4. Check for images and avatar 
    5. Upload them to cloudinery 
    6. Create user object 
    7. Remove password and referesh token from response 
    8. Check for user Creation 
    9. Return Response 
    */


    const { fullName, email, userName, password } = req.body
    //   validation part 

    if (fullName === "") {
        throw new ApiError(400, "Full Name is Required ")
    }
    if (email === "") {
        throw new ApiError(400, "Email is Required ")
    }
    if (userName === "") {
        throw new ApiError(400, "User Name  is Required ")
    }
    if (password === "") {
        throw new ApiError(400, "Password is Required ")
    }

    //   checking for Existing user 
    const existingUser = User.findOne({

        $or: [{ userName }, { email }]
    })
    if (existingUser) {
        throw new ApiError(409, "User with email or userName is alrady exists ")
    }

    // handling Files using multer 

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar Image is required ")
    }
    // uploading files on cloudinery 
    const avatar = await uploadFilesOnCloudiney(avatarLocalPath)
    const coverImage = await uploadFilesOnCloudiney(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required to upload on cloudinery ")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })
    const createdUser = await user.findbyId(user._id).select(
        "-password -refereshToken"
    )
    if (!coverImageLocalPath) {
        throw new ApiError(500, "Somenting Went Wrong Creating A User ")
    }
    return res.status(201).json(
        new Apiresponse(200, createdUser, "user Registred Successfully")

    )
})

export { registerUser }