import { asyncHandler } from "../utils/asyncHandlers.mjs";
import { ApiError } from "../utils/apiError.mjs";
// import { Comment } from "../models/comments.models.mjs";
import { ApiResponse } from "../utils/apiResponse.mjs";
import { prisma } from "../db/db.mjs";
// import mongoose from "mongoose";
// import Post from "../../../frontend/src/pages/Post";

const getPostComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { PostId } = req.params;

  // const { page = 1, limit = 10 } = req.query;
  // const comments = await Comment.aggregate([
  //   {
  //     $match: {
  //       Post: new mongoose.Types.ObjectId(PostId),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "owner",
  //       foreignField: "_id",
  //       as: "owner",
  //       pipeline: [
  //         {
  //           $project: {
  //             _id: 1,
  //             username: 1,
  //             fullName: 1,
  //             email: 1,
  //             avatar: 1,
  //             createdAt: 1,
  //             updatedAt: 1,
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {

  //   }
  // ]);
  // const comments = await Comment.aggregate([
  //   {
  //     $match: {
  //       Post: new mongoose.Types.ObjectId(PostId),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "owner",
  //       foreignField: "_id",
  //       as: "owner",
  //       pipeline: [
  //         {
  //           $project: {
  //             _id: 1,
  //             username: 1,
  //             fullName: 1,
  //             email: 1,
  //             avatar: 1,
  //             createdAt: 1,
  //             updatedAt: 1,
  //           },
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: null,
  //       comments: { $push: "$$ROOT" },
  //       count: { $sum: 1 }, // Add a count field to count the number of comments
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 0,
  //       comments: 1,
  //       count: 1,
  //     },
  //   },
  // ]);

  const comments = await prisma.comment.findMany({
    where: { postId: Number(PostId) },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          fullName: true,
          email: true,
          avatar: true,
        },
      },
    },
  });
  const commentCount = await prisma.comment.count({
    where: { postId: Number(PostId) },
  });

  if (!comments) {
    throw new ApiError(404, "Comments not found");
  }
  // const count = await Comment.countDocuments();
  if (!commentCount) {
    throw new ApiError(404, "Comments count not found");
  }

  // const commentsWithCount = {
  //   count,
  //   ...comments,
  // };
  return res.json(
    new ApiResponse(
      200,
      { comments: comments, count: commentCount },
      "Comments fetched successfully"
    )
  );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { PostId } = req.params;
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  // const post = await Post.findById(PostId);
  // if (!post) {
  //     throw new ApiError(404, "Post not found");
  // }

  const comment = await prisma.comment.create({
    data: {
      content: content,
      postId: Number(PostId),
      ownerId: Number(req.user?.id),
    },
  });

  // const postWithComment = await Post.findById(PostId);
  // const postWithComment = await prisma.post.findUnique({
  //   where: { id: PostId },
  //   include: { comments: true },
  // });
  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { CommentId } = req.params;
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  // const comment = await Comment.findById(CommentId);
  const comment = await prisma.comment.update({
    where: { id: Number(CommentId) },
    data: { content: content },
  });
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  // comment.content = content;
  // await comment.save();
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { CommentId } = req.params;
  if (!CommentId) {
    throw new ApiError(400, "CommentId is required");
  }
  // const deletedComment = await Comment.findByIdAndDelete(CommentId);
  const deletedComment = await prisma.comment.delete({
    where: { id: Number(CommentId) },
  });
  if (!deletedComment) {
    throw new ApiError(404, "Comment not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

const addLikes = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const commentId = req.params.CommentId;
  const postId = req.params.PostId;
  // const comment = await Comment.findByIdAndUpdate(
  //   commentId,
  //   { $addToSet: { likes: userId } },
  //   { new: true }
  // );
  const [like, updatedComment] = await prisma.$transaction([
    prisma.like.create({
      data: {
        commentId: Number(commentId),
        userId: Number(userId),
      },
    }),
    prisma.comment.update({
      where: { id: Number(commentId) },
      data: { likes_count: { increment: 1 } },
    }),
  ]);

  if (!updatedComment) {
    throw new ApiError(404, "Comment not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { like: like, updatedComment: updatedComment },
        "Comment liked successfully"
      )
    );
});

const disLike = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const commentId = req.params.CommentId;
  // const comment = await Comment.findByIdAndUpdate(
  //   commentId,
  //   { $pull: { likes: userId } },
  //   { new: true }
  // );

  const deletedLike = await prisma.like.delete({
    where: {
      userId_commentId: {
        userId: Number(userId),
        commentId: Number(commentId),
      },
    },
  });

  if (!deletedLike) {
    throw new ApiError(404, "Like not found or already removed");
  }

  const updatedComment = await prisma.comment.update({
    where: { id: Number(commentId) },
    data: { likes_count: { decrement: 1 } },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        disLike: disLike,
        updateComment: updatedComment,
      },
      "Comment disliked successfully"
    )
  );
});

const getLikes = asyncHandler(async (req, res) => {
  const commentId = req.params.CommentId;
    //   const comment = await Comment.findById(commentId);
    // const comment = await prisma.comment.findUnique({
    //   where: {
    //     id: commentId,
    //     },
    //     select: {
    //     likes: true,
    //   },
    // });
  
  const comment = await prisma.like.findMany({
    where: {
      commentId: Number(commentId),
    },
    select: {
      userId: true,
    },
  });

  const userId_comment = comment.map((like) => like.userId);
  if (!comment) {
    throw new ApiError(404, "Post not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, userId_comment, "get liked successfully"));
});

export {
  getPostComments,
  addComment,
  updateComment,
  deleteComment,
  addLikes,
  disLike,
  getLikes,
};
