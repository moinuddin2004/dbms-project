import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container, Input } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";
import Comment from "../components/Comment";
import mime from "mime";


export default function Post() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  // const [editingCommentId, setEditingCommentId] = useState(null);
  // const [like, setLike] = useState(0);
  // const [liked, setLiked] = useState(false);
  const [isloggedin, setIsloggedin] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  // console.log(post);
  const isAuthor = post && userData ? post.ownerId === userData.id : false;
  const { register, handleSubmit, reset } = useForm();
  // console.log(userData);
  useEffect(() => {
    setIsloggedin(userData ? true : false);
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/v1/posts/post/${id}`);
        // console.log(response.data);
        // console.log(response.data.data);
        setPost(response.data.data);
        setComments(response.data.data.comments);

        // const commentsResponse = await axios.get(`/api/v1/comments/${id}`);
      } catch (error) {
        console.error("Error fetching post and comments:", error);
      }
    };

    fetchData();
  }, [id, navigate, userData]);

  const deletePost = async () => {
    try {
      await axios.delete(`/api/v1/posts/delete-post/${id}`);
      navigate("/profile");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`/api/v1/comments/${id}`, {
        content: data.content,
      });
      const getComment = await axios.get(`/api/v1/comments/${id}`);
      // console.log(getComment.data.data.comments);
      setComments(getComment.data.data.comments);
      reset(); 
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = (commentId) => {
    setComments(comments.filter((comment) => comment.id !== commentId));
  };
  const isThumbnailValid =typeof post?.thumbnail === "string" && post.thumbnail.trim() !== "";
  const isImage = isThumbnailValid && mime.getType(post.thumbnail)?.startsWith("image/");
  // const isImage = post.thumbnail.includes("/image")

  return post && isThumbnailValid ? (
    <div className="py-8  bg-gradient-to-br from-blue-300 via-pink-200 to-red-100">
      <Container>
        <img
          src="/logo.svg"
          alt=""
          className="bg-transparent mix-blend-multiply h-[50px] w-[200px] fixed top-[50px]"
        />
        <div className="mt-[100px] flex justify-center  mb-4   rounded-xl ">
          {isImage ? (
            <img
              src={post.thumbnail}
              alt={post.title}
              className="rounded-xl  border-4   "
            />
          ) : (
            <video
              className="rounded-xl  border-4 max-w-[3
            
            
            00px] "
              controls
            >
              <source src={post.thumbnail} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post.id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <img
              src={post.owner.avatar}
              alt="avatar"
              className="rounded-full w-10 h-10 border-2 border-gray-700"
            />
            <span>{post.owner.username}</span>
          </div>
        </div>
        <div className="w-full mb-6">
          <h1 className="text-2xl font-bold">{post.title}</h1>
        </div>
        <div className="browser-css">{parse(post.description)}</div>

        {isloggedin && (
          <div>
            <div>
              <h3 className="text-xl font-bold mt-8">Add Comments</h3>
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    {...register("content", { required: true })}
                    placeholder="Enter your comment"
                  />
                  <Button type="submit" bgColor="bg-blue-500" className="mt-2">
                    Add Comment
                  </Button>
                </form>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mt-8">Comments</h2>
              <p className="text-xl font-bold mt-1">
                Total comments: {comments.length}{" "}
              </p>
              {comments
                .slice(0)
                .reverse()
                .map((comment) => (
                  <div key={comment.id}>
                    <Comment {...comment} onDelete={deleteComment} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  ) : null;
}
