import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";


function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    setError("");
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar[0]);
    console.log(formData);

    try {
      const userData = await axios.post("/api/v1/users/register", formData );
     if(userData) {
      navigate("/login");
     }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center  text-slate-500 mt-6">
      <div
        className={`mx-auto w-full max-w-lg bg-pink-100 rounded-xl p-10 border  border-black/10`}
      >
        <img
          src="/logo.svg"
          alt=""
          className="bg-transparent mix-blend-multiply h-[70px]  m-auto "
        />
        <h2 className="text-center text-2xl font-bold leading-tight  text-purple-500 ">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5">
            <Input
              label="avatar: "
              type="file"
              className="file-input file-input-bordered file-input-info w-full input-accent "
              placeholder="Enter your avatar"
              {...register("avatar", {
                required: true,
              })}
            />

            <Input
              label="User Name: "
              className="input input-bordered flex items-center gap-2 w-full input-accent "
              placeholder="Enter your user name"
              {...register("username", {
                required: true,
              })}
            />
            <Input
              label="Full Name: "
              className="input input-bordered flex items-center gap-2 w-full input-accent "
              placeholder="Enter your full name"
              {...register("fullName", {
                required: true,
              })}
            />
            <Input
              label="Email: "
              className="input input-bordered flex items-center gap-2 w-full input-accent"
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
            <Input
              label="Password: "
              className="input input-bordered flex items-center gap-2 w-full input-accent"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
