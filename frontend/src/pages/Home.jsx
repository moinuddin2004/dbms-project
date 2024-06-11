import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import axios from "axios";
import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";
import { useSelector } from "react-redux";
function Home() {
  const [posts, setPosts] = useState([]);
  // const [likes, setLikes] = useState(0);
  // const userStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    (async () => {
      const response = await axios.get("/api/v1/posts/all-Posts");
      console.log(response.data.data);

      setPosts(response.data.data);

      // const { data } = await axios.get(`/api/v1/posts/get-likes/${post}`);
      // console.log(data);
      // setLikes(data.likes);
    })();
  }, []);

  if (posts.length === 0) {
    return (
      // <BackgroundGradientAnimation>
        <div className="w-full h-screen text-center bg-gradient-to-br  from-blue-300 via-pink-200 to-red-100">
          <Container>
            <div className="flex flex-wrap justify-center items-center">
              <div className="p-2 w-full">
                <h1 className="text-2xl font-bold hover:text-gray-500 ">
                   no posts
                </h1>
              </div>
            </div>
          </Container>
        </div>
      // </BackgroundGradientAnimation>
    );
  }
  return (
    <div className="w-full h-full py-4   bg-gradient-to-br from-blue-300 via-pink-200 to-red-100">
      <Container>
        <img
          src="/logo.svg"
          alt=""
          className="bg-transparent mix-blend-multiply h-[50px] w-[200px] fixed top-[50px]"
        />
        <div className=" mt-[120px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8  ">
          {posts.map((post) => (
            <div key={post.id}>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
