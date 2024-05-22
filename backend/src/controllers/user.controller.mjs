import { asyncHandler } from "../utils/asyncHandlers.mjs";
import { ApiError } from "../utils/apiError.mjs";
import {prisma} from "../db/db.mjs"
// import { User } from "../models/user.models.mjs";
import { uploadOnCloudinary } from "../utils/cloudinary.mjs";
import { ApiResponse } from "../utils/apiResponse.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import mongoose from "mongoose";
// import nodemailer from "nodemailer";

// const generateAccessAndRefreshTokens = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();

//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });

//     return { accessToken, refreshToken };
//   } catch (error) {
//     throw new ApiError(
//       500,
//       "Something went wrong while generating refresh and access token"
//     );
//   }
// };

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  } )

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  const avatarLocalPath = req.file?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
 const salt = await bcrypt.genSalt(10);
 const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: {
      fullName,
      avatar: avatar.url,
      email,
      password: hashedPassword,
      username: username.toLowerCase(),
    }
  });

  const createdUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      fullName: true,
      email: true,
      username: true,
      avatar: true,
    }
  })

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered Successfully"));
  });

//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
//     user._id
//   );

//   const options = {
//     httpOnly: true,
//     secure: true,
//   };

//   return res
//     .status(201)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(new ApiResponse(200, createdUser, "User registered Successfully"));
// });

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and refresh token
  //send cookie

  const { email, username, password } = req.body;
  console.log(email);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }



  // const user = await User.findOne({
  //   $or: [{ username }, { email }],
  // });

  const user= await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  })

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // const isPasswordValid = await user.comparePassword(password);


  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
  //   user._id
    // );
    
    
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

  // const loggedInUser = await User.findById(user._id).select(
  //   "-password -refreshToken"
    // );
    const loggedInUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        fullName: true,
        email: true,
        username: true,
        avatar: true,
      }
    })

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {

  // await User.findByIdAndUpdate(
  //   req.user._id,
  //   {
  //     $unset: {
  //       refreshToken: 1, 
  //     },
  //   },
  //   {
  //     new: true,
  //   }
  // );
  
  
  // await prisma.user.update({
  //     where: {
  //       id: req.user.id,
  //     },
  //     data: {
  //       accessToken: null,
  //     },
  //   });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

// const refreshAccessToken = asyncHandler(async (req, res) => {
//   const incomingRefreshToken =
//     req.cookies.refreshToken || req.body.refreshToken;

//   if (!incomingRefreshToken) {
//     throw new ApiError(401, "unauthorized request");
//   }

//   try {
//     const decodedToken = jwt.verify(
//       incomingRefreshToken,
//       process.env.REFRESH_TOKEN_SECRET
//     );

//     const user = await User.findById(decodedToken?._id);

//     if (!user) {
//       throw new ApiError(401, "Invalid refresh token");
//     }

//     if (incomingRefreshToken !== user?.refreshToken) {
//       throw new ApiError(401, "Refresh token is expired or used");
//     }

//     const options = {
//       httpOnly: true,
//       secure: true,
//     };

//     const { accessToken, newRefreshToken } =
//       await generateAccessAndRefreshTokens(user._id);

//     return res
//       .status(200)
//       .cookie("accessToken", accessToken, options)
//       .cookie("refreshToken", newRefreshToken, options)
//       .json(
//         new ApiResponse(
//           200,
//           { accessToken, refreshToken: newRefreshToken },
//           "Access token refreshed"
//         )
//       );
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Invalid refresh token");
//   }
// });



const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // const user = await User.findById(req.user?._id);
  const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
    })
  // const isPasswordCorrect = await user.comparePassword(oldPassword);

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   // console.log(email);
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }
//   const token = user.generateResetPasswordToken();

//   if (!token) {
//     throw new ApiError(500, "Error while generating reset password token");
//   }
//   let text = `Subject: Reset Your Password

// Dear ${user.fullName},

// You recently requested to reset your password for your account. Please click the link below to reset your password:

// ${`http://localhost:5173/reset-password/${user}/${token}`}

// If you did not request a password reset, please ignore this email. This link is valid for [expiry time] hours.

// Thank you,
// MOIN'S Team"`;
// // console.log(process.env.EMAIL_PASSWORD);

//   var transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });



//   var mailOptions = {
//     from: `<${process.env.EMAIL}>`,
//     to: email,
//     subject: "Reset Your Password",
//     text: text,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error.message);
//     } else {
//      return res.status(200).json(new ApiResponse(200, {}, "Email sent successfully"));
//     }
//   });
// });



const getCurrentUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  // const user = await User.findByIdAndUpdate(
  //   req.user?._id,
  //   {
  //     $set: {
  //       fullName,
  //       email: email,
  //     },
  //   },
  //   { new: true }
  // ).select("-password");
  const user = await prisma.user.update({
    where: {
      id: req.user?.id,
    },
    data: {
      fullName,
      email,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading on avatar");
  }

  // const user = await User.findByIdAndUpdate(
  //   req.user?._id,
  //   {
  //     $set: {
  //       avatar: avatar.url,
  //     },
  //   },
  //   { new: true }
  // ).select("-password");

  const user =await prisma.user.update({
    where: {
      id: req.user?.id,
    },
    data: {
      avatar: avatar.url,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});

const getAllUser= asyncHandler(async (req, res) => {
  
  const users = await prisma.user.findMany();

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  // refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getAllUser,
  // resetPassword,
  // forgotPassword,
};