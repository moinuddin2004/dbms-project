import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
import { useSelector } from "react-redux";
import { BackgroundGradient } from "../components/ui/background-gradient";

function PostCard({ _id, title, thumbnail, likes, owner }) {
  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState(0);
  const userData = useSelector((state) => state.auth.userData);
  const handleLike = async () => {
    try {
      if (!liked) {
        await axios.patch(`/api/v1/posts/add-like/${_id}`);
        setLike(like + 1); // Increment like count
      } else {
        await axios.patch(`/api/v1/posts/dis-like/${_id}`);
        setLike(like - 1); // Decrement like count
      }
      setLiked(!liked); // Toggle liked state
    } catch (error) {
      console.error("Error toggling like/dislike:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const res = await axios.get(`/api/v1/posts/get-likes/${_id}`);
      setLike(res.data.data);
      setLiked(likes.includes(userData._id)); // Set liked state based on whether current user has liked the post
    })();
  }, []);

  return (
    <BackgroundGradient className="">
      <div className="bg-black rounded-[20px]  p-5 h-[350px]">
        <Link to={`/post/${_id}`}>
          <div className="text-slate-500 mb-2">{title}</div>
          <div>
            <img
              src={thumbnail}
              height="1000"
              width="1000"
              className="max-h-[180px] w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </div>
        </Link>

        <div className="flex justify-between  mt-8">
          <div>
            <span
              className={`fas fa-heart ${
                liked ? "text-red-500" : "text-gray-500"
              }`}
              onClick={handleLike}
              style={{ cursor: "pointer" }}
            ></span>
            <span className="ml-1 text-slate-500">{like}</span>
          </div>
          <img
            src={owner.avatar}
            alt=""
            className="rounded-full w-[40px] h-[40px]"
          />
        </div>
      </div>
    </BackgroundGradient>

    // <div className="w-full bg-gray-100 rounded-xl p-4">
    //   <Link to={`/post/${_id}`}>
    //     <div className="w-full justify-center mb-4">
    //       <img src={thumbnail} alt={title} className="rounded-xl" />
    //     </div>
    //     <h2 className="text-xl font-bold">{title}</h2>
    //     <p></p>
    //   </Link>
    //   <span
    //     className={`fas fa-heart ${liked ? "text-red-500" : "text-gray-500"}`}
    //     onClick={handleLike}
    //     style={{ cursor: "pointer" }}
    //   ></span>
    //   <span className="ml-1">{like}</span>
    // </div>
  );
}

export default PostCard;





