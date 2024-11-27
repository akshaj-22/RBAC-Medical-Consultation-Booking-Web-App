import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const res = await fetch("/api/logout");
      if (res.ok) {
        toast.success("Logout success");
        navigate("/");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full font-semibold shadow hover:bg-blue-600 hover:scale-105 transition-transform duration-200" onClick={logout}>Logout</button>;
};

export default Logout;
