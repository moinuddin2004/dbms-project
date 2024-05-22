import React, { useState, useEffect } from "react";
import { Container, Input, PostCard, Button } from "../components";
import axios from "axios";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

const refreshToken = async () => {
  try {
    const response = await axios.post("/api/v1/users/refresh-accessToken");
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
};

// Example of how to get the expiration time of the access token (adjust as needed)
const accessTokenExpiration = Date.now() + 86400 * 1000; // 1 day in milliseconds

// Check if the access token is expired or close to expiration
const checkAccessTokenExpiration = () => {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const expirationThreshold = 300; // 5 minutes
  if (accessTokenExpiration - currentTime < expirationThreshold) {
    refreshToken();
  }
};

// Check the access token expiration when the app is initialized or when a protected route is accessed
checkAccessTokenExpiration();

function Profile() {
  const userData = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const { register, handleSubmit } = useForm();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [password, setPassword] = useState("");
  const ChangePassword = async (data) => {
    console.log(data);
    try {
      const response = await axios.patch("/api/v1/users/change-password", data);

      console.log(response);
      setShowChangePassword(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    (async () => {
      const response = await axios.get("/api/v1/posts/get-user-all-Post");
      setPosts(response.data.data);
      console.log(response.data.data);
    })();
  }, []);

  const toggleChangePassword = () => {
    setShowChangePassword((prev) => !prev);
  };

  return (
    <div className="w-full py-8   bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <Container>
        <div className="flex  mb-8  mt-[100px] items-center gap-7">
          <img
            src={userData.avatar}
            alt=""
            className="rounded-full w-40 h-40 mb-2  border-4  border-blue-700 "/>
          <div>
            <h3 className="text-2xl font-bold  ">{userData.fullName}</h3>
            <p className="text-gray-600">Email: {userData.email}</p>
            <p className="text-gray-600">Username: {userData.username}</p>
          </div>

          <button
            onClick={toggleChangePassword}
            className="bg-orange-400 text-white px-4 py-2 rounded absolute top-10 max-sm:top-[300px] right-0 m-2 "
          >
            Change Password
          </button>
          {showChangePassword && (
            <div className="absolute max-sm:top-[100px] z-40 top-0 right-0 bg-white p-4 rounded shadow-lg w-[300px] max-h-[350px]  mt-10">
              {/* Content for changing password */}
              <div className="flex flex-row-reverse justify-between cursor-pointer">
                <p onClick={toggleChangePassword} className="">
                  ❌{" "}
                </p>
                <h2 className="text-lg font-bold mb-2">Change Password</h2>
              </div>
              <form onSubmit={handleSubmit(ChangePassword)} className="mt-8">
                <div className="space-y-5">
                  <Input
                    label="Password: "
                    type="password"
                    placeholder="Enter your old password"
                    {...register("oldPassword", {
                      required: true,
                    })}
                  />
                  {/* oldPassword, newPassword */}
                  <Input
                    label="New Password: "
                    type="password"
                    placeholder="Enter your New password"
                    {...register("newPassword", {
                      required: true,
                    })}
                  />
                  <br />
                  <Button type="submit" className="w-full">
                    ChangePassword
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 ">
            {posts.map((post) => (
              <div key={post._id} className="">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Profile;
