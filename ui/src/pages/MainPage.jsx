import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/MainPage.css';

const MainPage = () => {
  useEffect(() => {
    // Function to add admin
    const addAdmin = async () => {
      try {
        const response = await fetch('/api/add-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Admin created successfully:', data);
        } else {
          console.error('Error creating admin:', data.message);
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    };

    addAdmin();
  }, []); // Empty dependency array to run only once

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-cover" style={{
      backgroundImage: `url("https://c7.alamy.com/comp/2HE24XM/doctor-online-consultation-concept-stethoscope-and-mockup-smartphone-isolated-on-white-background-mobile-medical-application-in-cell-phone-with-heal-2HE24XM.jpg")`,
    }}>
      <div className="text-center animate-fadeInUp max-w-lg mx-auto bg-slate-400 bg-opacity-70 px-6 py-8 shadow-lg rounded-md border">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-8 text-white drop-shadow-md">BookMyConsult</h1>
        <p className="text-xl md:text-lg mb-6 md:mb-8 text-white opacity-90">Connect with top healthcare professionals anytime, anywhere.</p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
          <Link to="/login" className="bg-white text-blue-500 px-6 py-3 rounded-full shadow-lg font-bold hover:bg-blue-600 hover:text-white transition duration-300 inline-flex items-center justify-center space-x-2 transform hover:scale-105 animate-pulse w-full md:w-auto">
            <span>Log In</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </Link>
          <Link to="/sign-up" className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg font-bold hover:bg-white hover:text-blue-600 transition duration-300 inline-flex items-center justify-center space-x-2 transform hover:scale-105 animate-pulse w-full md:w-auto">
            <span>Sign Up</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainPage;


