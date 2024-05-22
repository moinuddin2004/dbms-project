import React, { useEffect, useState } from "react";
// import appwriteService from "../appwrite/database";
import { Container, PostCard } from "../components";
import axios from "axios";
import { BackgroundGradientAnimation } from "../components/ui/background-gradient-animation";
function Home() {
  const [posts, setPosts] = useState([]);
  // const [likes, setLikes] = useState(0);

  useEffect(() => {
    (async () => {
      const response = await axios.get("/api/v1/posts/all-Posts");
      console.log(response.data.data);

      setPosts([...response.data.data]);

      // const { data } = await axios.get(`/api/v1/posts/get-likes/${post}`);
      // console.log(data);
      // setLikes(data.likes);
    })();
  }, []);

  if (posts.length === 0) {
    return (
      <div className="w-full h-screen py-8 mt-4 text-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        {/* <BackgroundGradientAnimation> */}
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                Login to read posts
              </h1>
            </div>
          </div>
        </Container>
        {/* </BackgroundGradientAnimation> */}
      </div>
    );
  }
  return (
    <div className="w-full h-full py-4   bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Container>
        <div className=" mt-[120px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8  ">
          {posts.map((post) => (
            <div key={post._id}>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Home;
