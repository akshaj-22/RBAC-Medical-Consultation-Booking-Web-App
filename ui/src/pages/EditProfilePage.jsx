import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const EditProfilePage = () => {
    const [profile, setProfile] = useState({ name: '', address: '', age: '', phone: '' });
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current profile data to populate form fields
        const fetchProfile = async () => {
            try {
                const response = await fetch('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/edit-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    newName: profile.name,
                    newAddress: profile.address,
                    newAge: profile.age, // Ensure age field is sent correctly
                    newPhone: profile.phone,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const data = await response.json();
            alert(data.message); // Show success message
            navigate('/profile'); // Redirect back to the profile page using navigate
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="h-screen flex flex-col w-full bg-sky-300">
            <h1 className="text-2xl text-center text-white font-bold mb-6 mt-5">Edit Profile</h1>
            
            <form onSubmit={handleSubmit} className="bg-white max-w-lg mx-auto p-6 shadow-lg rounded-lg shadow-lg shadow-blue-700 bg-opacity-70 shadow-lg rounded-md">
                <div className="mb-4">
                    <label className="block text-lg text-gray-800 font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-800 text-lg font-bold mb-2" htmlFor="address">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-800 text-lg font-bold mb-2" htmlFor="age">
                        Age
                    </label>
                    <input
                        type="number" // Changed to number for age input
                        id="age"
                        name="age"
                        value={profile.age}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-800 text-lg font-bold mb-2" htmlFor="phone">
                        Phone
                    </label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-700 text-white font-bold py-2 px-2 rounded shadow shadow-gray-800"
                >
                    Save Changes
                </button>
            </form>
            </div>
    );
};

export default EditProfilePage;
