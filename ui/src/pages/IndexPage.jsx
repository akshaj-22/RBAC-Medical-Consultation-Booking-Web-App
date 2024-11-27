import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/IndexPage.css'
import icon from '../assets/images/home.png'
import Navbar from '../components/Navbar'
import { getUserType } from './LoginPage'

const IndexPage = () => {
    const userType = getUserType();
    return (
        <>
            <div className="bg-sky-300">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="ml-10">
                        <h1 className="text-4xl font-bold mb-4 text-indigo-950">Your Health, Our Priority</h1>
                        <p className="text-lg mb-8 text-indigo-950">"Connect with top healthcare professionals anytime, anywhere. Experience seamless, secure, and personalized medical consultations from the comfort of your home."</p>
                        {userType == "user" ? (<Link to="/add-appointment" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg font-bold hover:bg-white hover:text-blue-500 transition duration-300">Get Started</Link>):(<Link to="/add-doctor" className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg font-bold hover:bg-white hover:text-blue-500 transition duration-300">Get Started</Link>)}
                    </div>
                    <div className="ml-20 animate-float">
                        <img src={icon} alt="Home Image"/>
                    </div>
                </div>
                <footer className="bg-blue-600 text-white p-4 text-center">
                    © 2024 Medical Consultation. All rights reserved.
                </footer>
            </div>
        </>
    )
}

export default IndexPage