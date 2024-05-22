import { asyncHandler } from "../utils/asyncHandlers.mjs";
import { ApiError } from "../utils/apiError.mjs";
// import { Post } from "../models/post.models.mjs";
import { Prisma } from "../db/db.mjs";
import { uploadOnCloudinary } from "../utils/cloudinary.mjs";
import { ApiResponse } from "../utils/apiResponse.mjs";
// import mongoose from "mongoose";


const createPost = asyncHandler(async (req, res) => {
  // get post details from frontend
  // validation - not empty
  // check for thumbnail
  // upload them to cloudinary,thumbnail
  // create post object - create entry in db
  // check for user creation
  // return res

  const { title, description } = req.body;
  const userId = req.user?._id;
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  // req.files?.thumbnail[0]?.path;
  const thumbnailLocalPath = req.file?.path;
  console.log(thumbnailLocalPath);
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const post = await Post.create({
    title,
    description,
    thumbnail: thumbnail.url,
    owner: userId,
  });
  const createdPost = await Post.findById(post._id);

  if (!createdPost) {
    throw new ApiError(400, "Post creation failed");
  }
  return res
    .status(201)
    .json(new ApiResponse(post, "Post created successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const allPosts = await Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              email: 1,
              avatar: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $arrayElemAt: ["$ownerDetails", 0],
        },
      },
    },
    {
      $project: {
        ownerDetails: 0,
      },
    },
  ]);

  // console.log(allPosts);
  // Check if any posts are found
  if (!allPosts || allPosts.length === 0) {
    throw new ApiError(404, "No posts found");
  }

  // Return the list of posts
  return res
    .status(200)
    .json(new ApiResponse(200, allPosts, "Posts fetched successfully"));
});

const getUserAllPosts = asyncHandler(async (req, res) => {
  // Extract the user ID from the request
  const userId = req.user?._id;

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // Fetch all posts belonging to the user
  const posts = await Post.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              email: 1,
              avatar: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $arrayElemAt: ["$ownerDetails", 0],
        },
      },
    },
    {
      $project: {
        ownerDetails: 0,
      },
    },
  ]);

  if (!posts || posts.length === 0) {
    throw new ApiError(404, "No posts found");
  }

  // Return the fetched posts
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "User's posts fetched successfully"));
});
const getPost = asyncHandler(async (req, res) => {
  // Fetch a single post from the database by ID
  const postId = req.params.postId;
  console.log(postId);
  const post = await Post.findById(postId);

  // Check if the post is found
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Return the post as the response
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post fetched successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const postId = req.params.postId;
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  console.log(title, description);
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        title: title,
        description: description,
      },
    },
    { new: true }
  ).select("-thumbnail");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

const updateThumbnail = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const updatedPostWithThumbnail = await Post.findByIdAndUpdate(
    postId,
    {
      $set: {
        thumbnail: thumbnail.url,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPostWithThumbnail,
        "Post updated successfully"
      )
    );
});

const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const deletedPost = await Post.findByIdAndDelete(postId);
  if (!deletedPost) {
    throw new ApiError(404, "Post not found in delete");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

const addLikes = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const postId = req.params.postId;
  const post = await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { likes: userId } },
    { new: true }
  );
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post liked successfully"));
});

const disLike = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const postId = req.params.postId;
  const post = await Post.findByIdAndUpdate(
    postId,
    { $pull: { likes: userId } },
    { new: true }
  );
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post disliked successfully"));
});

const getLikes = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, post.likes.length, "Post liked successfully"));
});

export {
  createPost,
  getAllPosts,
  getUserAllPosts,
  getPost,
  updatePost,
  deletePost,
  updateThumbnail,
  addLikes,
  getLikes,
  disLike,
};
