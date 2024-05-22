import React from "react";
import { Container, PostForm } from "../components";

function AddPost() {
  return (
    <div className="py-8 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Container>
        <PostForm />
      </Container>
    </div>
  );
}

export default AddPost;
