import React, { useState } from "react";
import {jwtDecode} from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginSubmit = async (e) => {
    e.preventDefault();
    const loginDetails = {
      email,
      password,
    };

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginDetails),
    });
    console.log(res, "login res from /login");
    if (res.ok) {
      const data = await res.json();
      console.log("/login resp json", data);
      const userType = data.userType;
      toast.success(`Logged in as: ${userType}`);
      return navigate("/home");
    } else {
      toast.error(`Please check your credentials`);
      return navigate("/");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-cover" style={{
      backgroundImage: `url("https://cdn.pixabay.com/photo/2017/08/10/03/30/stethoscope-2617701_960_720.jpg")`,
    }}>
      <div className="flex gap-[100px] items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md bg-opacity-70 shadow-lg rounded-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={loginSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
              Login
            </button>
          </form>
          <p className="mt-4 text-center">
            Don't have an account? <Link to="/sign-up" className="text-blue-600">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};


const getUserType = () => {
  const authToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("Authtoken"))
    ?.split("=")[1];
  console.log("documemnt.cookie vslue", authToken);

  const decoded = jwtDecode(authToken);
  console.log("decoded", decoded);
  const userType = decoded.userType;
  console.log("usertype", userType);
  return userType;
};

export { LoginPage as default, getUserType };


