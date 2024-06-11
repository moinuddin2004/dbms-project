import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";

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
   
 
  return post ? (
    <div className=" bg-gradient-to-br from-blue-300 via-pink-200 to-red-100">
      <Container>
      <img
        src="/logo.svg"
        alt=""
        className="bg-transparent mix-blend-multiply h-[50px] w-[200px] fixed top-[50px]"
      />
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
