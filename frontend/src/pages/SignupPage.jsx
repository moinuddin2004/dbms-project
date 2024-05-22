import React from "react";
import { Signup as SignupComponent } from "../components";
import { Meteors } from "../components/ui/meteors";
function Signup() {
  return (
    <div className="w-full bg-[#0F172A] text-white flex justify-center items-center  min-h-screen p-[100px] ">
      <Meteors number={20} />
      <SignupComponent />
    </div>
  );
}

export default Signup;
