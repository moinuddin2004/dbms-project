import React from "react";
import { logout } from "../../store/authSlice.js";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function LogoutBtn() {
  const dispatch = useDispatch();
const Navigate=useNavigate()
  const logoutHandler = async () => {
    try {
      const response = await axios.post("/api/v1/users/logout");
      
      dispatch(logout());
      Navigate("/");
    
    } catch (error) {
      console.log(" logout :: error", error);
    }
  };
  return (
    <button
      className="px-8 py-2 rounded-full relative bg-slate-700 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600"
      onClick={logoutHandler}
    >
      <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
      <span className="relative z-20">logout</span>
    </button>
    
  );
}

export default LogoutBtn;
