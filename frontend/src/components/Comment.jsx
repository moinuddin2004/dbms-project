import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Btn from "./Button";

const Comment = ({ id, content, owner, likes_count, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState(likes_count);
  const [updating, setUpdating] = useState(false);
  const [newContent, setNewContent] = useState(content);
  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = owner.id === userData.id;
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    (async () => {
      try {
        const like = await axios.get(`/api/v1/comments/like/${id}`);
        // setLike(res.data.data);
        // console.log(like);
        setLiked(like.data.data.includes(userData.id));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [id, userData.id]);

  const handleLike = async () => {
    try {
      if (!liked) {
        await axios.patch(`/api/v1/comments/like/${id}`);
        setLike(like + 1); // Increment like count
      } else {
        await axios.patch(`/api/v1/comments/dislike/${id}`);
        setLike(like - 1); // Decrement like count
      }
      setLiked(!liked); // Toggle liked state
    } catch (error) {
      console.error("Error toggling like/dislike:", error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`/api/v1/comments/c/${id}`);
      onDelete(id); // Update frontend by deleting the comment
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.patch(`/api/v1/comments/c/${id}`, { content: data.content });
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
            className="input input-bordered flex items-center gap-2 w-full input-accent"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-2 py-1 m-2 rounded-md"
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
            src={owner.avatar}
            alt={owner.id}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <div className="flex items-center">
              <p className="font-bold">{owner.username}</p>
              <span
                className={`fas fa-heart ml-2 ${
                  liked ? "text-red-500" : "text-gray-500"
                } cursor-pointer`}
                onClick={handleLike}
              />
              <span className="ml-1">{like}</span>
            </div>
            <div className="border-2 rounded-md w-auto bg-pink-200 max-h-96 overflow-y-auto max-w-[850px]">
              {newContent}
            </div>
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
