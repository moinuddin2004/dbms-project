import React from "react";
import Login from "../components/Login.jsx";
import { Meteors } from "../components/ui/meteors";

function LoginPage() {
  return (
    <div className="w-full bg-[#0F172A] text-white flex justify-center items-center  min-h-screen  ">
      <img
        src="/logo.svg"
        alt=""
        className="bg-transparent mix-blend-multiply h-[50px] w-[200px] fixed top-[50px]"
      />
      <Meteors number={20} /> <Login />
    </div>
  );
}

export default LoginPage;
