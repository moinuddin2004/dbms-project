// import { asyncHandler } from "../utils/asyncHandlers.mjs";
// import { ApiError } from "../utils/apiError.mjs";
// // import { Comment } from "../models/comments.models.mjs";
// import { ApiResponse } from "../utils/apiResponse.mjs";
// // import mongoose from "mongoose";
// // import Post from "../../../frontend/src/pages/Post";

// const getPostComments = asyncHandler(async (req, res) => {
//   //TODO: get all comments for a video
//   const { PostId } = req.params;
//   const { page = 1, limit = 10 } = req.query;
//   // const comments = await Comment.aggregate([
//   //   {
//   //     $match: {
//   //       Post: new mongoose.Types.ObjectId(PostId),
//   //     },
//   //   },
//   //   {
//   //     $lookup: {
//   //       from: "users",
//   //       localField: "owner",
//   //       foreignField: "_id",
//   //       as: "owner",
//   //       pipeline: [
//   //         {
//   //           $project: {
//   //             _id: 1,
//   //             username: 1,
//   //             fullName: 1,
//   //             email: 1,
//   //             avatar: 1,
//   //             createdAt: 1,
//   //             updatedAt: 1,
//   //           },
//   //         },
//   //       ],
//   //     },
//   //   },
//   //   {

//   //   }
//   // ]);
//   const comments = await Comment.aggregate([
//     {
//       $match: {
//         Post: new mongoose.Types.ObjectId(PostId),
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "owner",
//         foreignField: "_id",
//         as: "owner",
//         pipeline: [
//           {
//             $project: {
//               _id: 1,
//               username: 1,
//               fullName: 1,
//               email: 1,
//               avatar: 1,
//               createdAt: 1,
//               updatedAt: 1,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         comments: { $push: "$$ROOT" },
//         count: { $sum: 1 }, // Add a count field to count the number of comments
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         comments: 1,
//         count: 1,
//       },
//     },
//   ]);

//   if (!comments) {
//     throw new ApiError(404, "Comments not found");
//   }
//   const count = await Comment.countDocuments();
//   if (!count) {
//     throw new ApiError(404, "Comments not found");
//   }

//   // const commentsWithCount = {
//   //   count,
//   //   ...comments,
//   // };
//   return res.json(
//     new ApiResponse(200, comments, "Comments fetched successfully")
//   );
// });

// const addComment = asyncHandler(async (req, res) => {
//   // TODO: add a comment to a video
//   const { PostId } = req.params;
//   const { content } = req.body;
//   if (!content) {
//     throw new ApiError(400, "Content is required");
//   }
//   // const post = await Post.findById(PostId);
//   // if (!post) {
//   //     throw new ApiError(404, "Post not found");
//   // }
//   const comment = await Comment.create({
//     content,
//     Post: PostId,
//     owner: req.user?._id,
//   });
//   // const postWithComment = await Post.findById(PostId);
//   return res
//     .status(201)
//     .json(new ApiResponse(201, comment, "Comment added successfully"));
// });

// const updateComment = asyncHandler(async (req, res) => {
//   // TODO: update a comment
//   const { CommentId } = req.params;
//   const { content } = req.body;
//   if (!content) {
//     throw new ApiError(400, "Content is required");
//   }
//   const comment = await Comment.findById(CommentId);
//   if (!comment) {
//     throw new ApiError(404, "Comment not found");
//   }
//   comment.content = content;
//   await comment.save();
//   return res
//     .status(200)
//     .json(new ApiResponse(200, comment, "Comment updated successfully"));
// });

// const deleteComment = asyncHandler(async (req, res) => {
//   // TODO: delete a comment
//   const { CommentId } = req.params;
//   if (!CommentId) {
//     throw new ApiError(400, "CommentId is required");
//   }
//   const deletedComment = await Comment.findByIdAndDelete(CommentId);
//   if (!deletedComment) {
//     throw new ApiError(404, "Comment not found");
//   }
//   return res
//     .status(200)
//     .json(new ApiResponse(200, null, "Comment deleted successfully"));
// });


// const addLikes = asyncHandler(async (req, res) => {
//   const userId = req.user?._id;
//   const commentId = req.params.CommentId;
//   const comment = await Comment.findByIdAndUpdate(
//     commentId,
//     { $addToSet: { likes: userId } },
//     { new: true }
//   );
//   if (!comment) {
//     throw new ApiError(404, "Comment not found");
//   }
//   return res
//     .status(200)
//     .json(new ApiResponse(200, comment, "Comment liked successfully"));
// });

// const disLike = asyncHandler(async (req, res) => {
//   const userId = req.user?._id;
//   const commentId = req.params.CommentId;
//   const comment = await Comment.findByIdAndUpdate(
//     commentId,
//     { $pull: { likes: userId } },
//     { new: true }
//   );
//   if (!comment) {
//     throw new ApiError(404, "comment not found");
//   }
//   return res
//     .status(200)
//     .json(new ApiResponse(200, comment, "Comment disliked successfully"));
// });

// const getLikes = asyncHandler(async (req, res) => {
//   const commentId = req.params.CommentId;
//   const comment = await Comment.findById(commentId);
//   if (!comment) {
//     throw new ApiError(404, "Post not found");
//   }
//   return res
//     .status(200)
//     .json(
//       new ApiResponse(200, comment.likes.length, "get liked successfully")
//     );
// });




// export { getPostComments, addComment, updateComment, deleteComment,addLikes,disLike,getLikes };
