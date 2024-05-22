import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
// import appwriteService from "../appwrite/database";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditPost() {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
     useEffect(() => {
       (async () => {
         const response = await axios.get(`/api/v1/posts/post/${id}`);
         console.log(response.data.data);
         setPost(response.data.data);
       })();
     }, [id, navigate]);
    // if (slug) {
    //   appwriteService.getPost(slug).then((post) => {
    //     if (post) {
    //       setPosts(post);
    //     }
    //   });
    // } else {
    //   navigate("/");
    // }
 
  return post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
