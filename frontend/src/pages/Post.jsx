// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// // import appwriteService from "../appwrite/database";
// import { Button, Container } from "../components";
// import parse from "html-react-parser";
// import { useSelector } from "react-redux";
// import axios from "axios";

// export default function Post() {
//   const [post, setPost] = useState(null);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const userData = useSelector((state) => state.auth.userData);
// console.log(userData);
//   const isAuthor = post && userData ? post.owner === userData._id : false;
// console.log(id);
//   useEffect(() => {
//     (async () => {
//       const response = await axios.get(`/api/v1/posts/post/${id}`);
//       console.log(response.data.data);

//       setPost(response.data.data);
//     })();

//   }, [ id,navigate]);

//   const deletePost = () => {
//     const response = axios.delete(`/api/v1/posts/delete-post/${id}`);
//     navigate("/profile");

//   };

//   return post ? (
//     <div className="py-8">
//       <Container>
//         <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
//           <img
//             src={ post.thumbnail}
//             alt={post.title}
//             className="rounded-xl"
//           />

//           {isAuthor && (
//             <div className="absolute right-6 top-6">
//               <Link to={`/edit-post/${post._id}`}>
//                 <Button bgColor="bg-green-500" className="mr-3">
//                   Edit
//                 </Button>
//               </Link>
//               <Button bgColor="bg-red-500" onClick={deletePost}>
//                 Delete
//               </Button>
//             </div>
//           )}
//         </div>
//         <div className="w-full mb-6">
//           <h1 className="text-2xl font-bold">{post.title}</h1>
//         </div>
//         <div className="browser-css">{parse(post.description)}</div>
//         <div>

//         </div>
//       </Container>
//     </div>
//   ) : null;
// }

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Container, Input } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";
import Comment from "../components/Comment";

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
  const isAuthor = post && userData ? post.owner === userData._id : false;
  const { register, handleSubmit, reset } = useForm();
  console.log(userData);
  useEffect(() => {
    setIsloggedin(userData ? true : false);
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/v1/posts/post/${id}`);
        setPost(response.data.data);

        const commentsResponse = await axios.get(`/api/v1/comments/${id}`);
        setComments([...commentsResponse.data.data[0].comments]);
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
      setComments([...getComment.data.data[0].comments]);
      reset(); // Clear the form
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = (commentId) => {
    setComments(comments.filter((comment) => comment._id !== commentId));
  };

  return post ? (
    <div className="py-8  bg-gradient-to-br from-purple-400 via-blue-500 to-purple-500">
      <Container>
        <div className=" ml-[100px]  mt-[100px] flex justify-center  mb-4   rounded-xl ">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="rounded-xl border border-4"
          />
          {isAuthor && (
            <div className="absolute right-6 top-6">
              <Link to={`/edit-post/${post._id}`}>
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
              {comments
                .slice()
                .reverse()
                .map((comment) => (
                  <div key={comment._id}>
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
