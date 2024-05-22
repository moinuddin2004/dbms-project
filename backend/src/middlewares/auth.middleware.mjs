import { ApiError } from "../utils/apiError.mjs";
import { asyncHandler } from "../utils/asyncHandlers.mjs";
import jwt from "jsonwebtoken";
import {prisma} from "../db/db.mjs";
// import { User } from "../models/user.models.mjs";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken
      ||
      req.header("Authorization")?.replace("Bearer ", "");
 
    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
console.log(decodedToken);

    // const user = await User.findById(decodedToken?._id).select(
    //   "-password -refreshToken"
    // );

    const user = await prisma.user.findUnique({
      where: { id: decodedToken?.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
        avatar: true,
      }, 
    });

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
