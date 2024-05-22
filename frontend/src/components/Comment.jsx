import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Btn from "./Button";

const Comment = ({ _id, content, owner, likes, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState(0);
  const [updating, setUpdating] = useState(false);
    const [newContent, setNewContent] = useState(content);
  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = owner[0]._id === userData._id;
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/v1/comments/like/${_id}`);
        setLike(res.data.data);
        setLiked(likes.includes(userData._id));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [_id, likes, userData._id]);

  const handleLike = async () => {
    try {
      if (!liked) {
        await axios.patch(`/api/v1/comments/like/${_id}`);
        setLike(like + 1); // Increment like count
      } else {
        await axios.patch(`/api/v1/comments/dislike/${_id}`);
        setLike(like - 1); // Decrement like count
      }
      setLiked(!liked); // Toggle liked state
    } catch (error) {
      console.error("Error toggling like/dislike:", error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`/api/v1/comments/c/${_id}`);
      onDelete(_id); // Update frontend by deleting the comment
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.patch(`/api/v1/comments/c/${_id}`, { content: data.content });
      setNewContent(data.content);
      setUpdating(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div className="border-2 border-red-500 p-4  rounded-lg m-3 bg-purple-200">
      {updating ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
          <input
            type="text"
            defaultValue={newContent}
            {...register("content")}
            className="border-2 border-gray-400 rounded-md p-1 mr-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-2 py-1 rounded-md"
          >
            Update
          </button>
          <button
            onClick={() => setUpdating(false)}
            className="bg-gray-500 text-white px-2 py-1 rounded-md ml-2"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="flex items-center">
          <img
            src={owner[0].avatar}
            alt={owner[0]._id}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <div className="flex items-center">
              <p className="font-bold">{owner[0].username}</p>
              <span
                className={`fas fa-heart ml-2 ${
                  liked ? "text-red-500" : "text-gray-500"
                } cursor-pointer`}
                onClick={handleLike}
              />
              <span className="ml-1">{like}</span>
            </div>
            <div className=" border-2 rounded-md w-auto bg-pink-200">{newContent}</div>
          </div>

          {isAuthor && (
            <div className="ml-auto">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded-md"
                onClick={() => setUpdating(true)}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded-md ml-2"
                onClick={handleDeleteComment}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
