import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignupPage = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [address, setaddress] = useState("");
  const [password, setpassword] = useState("");
  const [age, setage] = useState("");
  const navigate = useNavigate();

  // signup
  const signupSubmit = async (userDetails) => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    });
    // return;
    console.log(res);
    if (res.ok) {
      toast.success(`Signup success`);
      return navigate("/");
    } else {
      toast.error(`Please check the input data`);
      return navigate("/sign-up");
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const userDetails = {
      name,
      email,
      password,
      age,
      address,
      phone
      
    };

    signupSubmit(userDetails);
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 bg-cover" style={{
      backgroundImage: `url("https://cdn.pixabay.com/photo/2017/08/10/03/30/stethoscope-2617701_960_720.jpg")`,
    }}>
    <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white py-3 px-8 m-10 rounded shadow-md w-full max-w-lg bg-opacity-70 shadow-lg rounded-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={submitForm}>
                <div className="mb-4">
                    <label className="block text-gray-700" for="name">Name</label>
                    <input type="text" 
                    id="name" 
                    name="name" 
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    className="w-full p-2 border rounded mt-1" required/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" for="email">Email</label>
                    <input type="email" 
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="w-full p-2 border rounded mt-1" required/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" for="password">Password</label>
                    <input type="password" 
                    id="password" 
                    name="password"
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    className="w-full p-2 border rounded mt-1" required/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" for="address">Age</label>
                    <input type="text" 
                    id="age" 
                    name="age"
                    value={age}
                    onChange={(e) => setage(e.target.value)}
                    className="w-full p-2 border rounded mt-1" required/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" for="address">Address</label>
                    <textarea 
                    id="address"
                    name="address" 
                    value={address}
                    onChange={(e) => setaddress(e.target.value)}
                    className="w-full p-2 border rounded mt-1" required></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700" for="phone">Phone Number</label>
                    <input type="text" 
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setphone(e.target.value)}
                    className="w-full p-2 border rounded mt-1" required/>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
            </form>
            <p className="mt-4 text-center">Already have an account? <Link to="login.html" className="text-blue-600">Login</Link></p>
        </div>
    </div>
</div>
  );
};

export default SignupPage;
