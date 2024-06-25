import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
// import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import axios from "axios";

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

    
    const send = async (data) => {
        setError("");
        console.log(data);
          try {
             await axios.post("/api/v1/users/forgot-password", data);
            // if (session) {
            //   const userData = await axios.get("/api/v1/users/current-user");
            //   console.log(userData.data.data);
            //   if (userData) dispatch(authLogin(userData.data.data));
            //   navigate("/");
            // }
          } catch (error) {
            setError(error.message);
          }
    }
    
//   const login = async (data) => {
//     setError("");
//     try {
//       const session = await axios.post("/api/v1/users/login", data);
//       if (session) {
//         const userData = await axios.get("/api/v1/users/current-user");
//         console.log(userData.data.data);
//         if (userData) dispatch(authLogin(userData.data.data));
//         navigate("/");
//       }
//     } catch (error) {
//       setError(error.message);
//     }
//   };

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 m-10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Forgot Password
        </h2>
         <p className="mt-2 text-center text-base text-black/60">
         enter your email to reset you password</p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(send)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
           
            <Button type="submit" className="w-full">
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
