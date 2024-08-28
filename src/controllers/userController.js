import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { User } from "../modles/userModel.js"

import { uploadFilesOnCloudiney } from "../utils/cloudinery.js"

// writng methods to generate access and referesh tokens 
const generateAccessAndReferehTokens = async (userId) => {
    try {
        const user = User.findById(userId)
        const accessToekn = user.generateAccesstoken()
        const refereshToken = user.generateRefereshtoken()
        user.refereshToken = refereshToken
        await user.save({ validateBeforeSave: false })


        return { accessToekn, refereshToken }
    } catch (error) {
        throw new ApiError(500, "Error While generating access and refereh tokens ");

    }
}

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

    console.log(req.body);

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
    const existingUser = await User.findOne({

        $or: [{ userName }, { email }]
    })
    if (existingUser) {
        throw new ApiError(409, "User with email or userName is alrady exists ")
    }

    // handling Files using multer 
    const avatarLocalPath = req.files?.avatar && req.files.avatar.length > 0 ? req.files.avatar[0].path : undefined;
    const coverImageLocalPath = req.files?.coverImage && req.files.coverImage.length > 0 ? req.files.coverImage[0].path : undefined;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar Image is required ");
    }

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
        userName
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refereshToken"
    )

    return res.status(201).json(
        new Apiresponse(200, createdUser, "user Registred Successfully")

    )
})


const loginUser = asyncHandler(async (req, res) => {

    /*
    task to do 
  1. to check all fields are there or not 
  2. To check all fields are entered are correct or not 
  3. Check of user is present or not 
  4. Generate access and referesh tokens 
  5. Send Cookies 

    */

    const { userName, email, password } = req.body

    if (!userName || !email) {
        throw new ApiError(400, "UserName or Email is required ")
    }
    if (!password) {
        throw new ApiError(400, "Password is required Field ");
    }

    // accessing users 
    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (!user) {
        throw new ApiError(400, "you are not registred ")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Password is Invalid ")
    }
    // generating Access and referesh Token 
    const { refereshToken, accessToekn } = await
        generateAccessAndReferehTokens(user._id);

    const loggedInUser = await User.findById(user._id).
        select("-passwrod -refereshToken")


    // working on cookies 

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .cookie("accessToken", accessToekn, options)
        .cookie("refereshToekn", refereshToken, options)
        .json(
            new Apiresponse(
                200, {
                user: loggedInUser, accessToekn, refereshToken
            },
                "User Logged in Successfully "
            )
        )
})

const logOutUser = asyncHandler(async (req, res) => {
    /*
    things to do 
    1. Clear all cookies 
    2. Reset referesh token
    */
    User.findByIdAndUpdate(req.user._id,
        {

            $set: { refereshToken: undefined }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.
        status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refereshToken", options)
        .json(new Apiresponse(200, {}, "User Logged Out "))
})

export {
    logOutUser,
    loginUser,
    registerUser
}