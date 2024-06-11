import React from "react";
import { Container, PostForm } from "../components";

function AddPost() {
  return (
    <div className="py-8 bg-gradient-to-br from-blue-300 via-pink-200 to-red-100">
      <Container>
      <img
        src="/logo.svg"
        alt=""
        className="bg-transparent mix-blend-multiply h-[50px] w-[200px] fixed top-[50px]"
      />
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;
