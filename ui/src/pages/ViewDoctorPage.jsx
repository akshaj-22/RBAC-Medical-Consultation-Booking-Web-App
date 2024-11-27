import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getUserType } from './LoginPage';

const ViewDoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  //get userType
  const userType = getUserType();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors', {
          method: 'GET',
          credentials: 'include', // Include cookies with the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const data = await response.json();
        setDoctors(data.doctors);
        setFilteredDoctors(data.doctors); // Initialize filtered doctors with all doctors
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors');
      }
    };

    fetchDoctors();
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filtered = doctors.filter((doctor) =>
      doctor.specialization.toLowerCase().includes(searchTerm)
    );

    setFilteredDoctors(filtered);
  };

  const handleEditDoctor = (doctorId) => {
    // Navigate to the edit doctor page with the doctor's ID
    navigate(`/edit-doctor/${doctorId}`);
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const response = await fetch(`/api/doctors/${doctorId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        alert('Doctor deleted successfully');
        setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));
        setFilteredDoctors(filteredDoctors.filter((doctor) => doctor._id !== doctorId));
      } else {
        alert('Failed to delete doctor');
      }
    } catch (err) {
      console.error('Error deleting doctor:', err);
      alert('Error deleting doctor');
    }
  };

  if (error) return <div>{error}</div>;
  if (doctors.length === 0) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col bg-sky-300">
      <main className="flex-grow flex flex-col items-center">
        <div className="w-full p-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by specialty"
            className="w-full p-2 mb-4 ml-2 rounded-2xl ring-2 ring-blue-500/50 hover:ring-blue-500 outline-none"
          />
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-xl m-2 w-full">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Available Doctors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredDoctors.map((doctor) => (
                <div key={doctor._id} className="doctor-card bg-white p-6 shadow shadow-black-800 rounded-lg">
                  <div className='px-4 py-4 shadow shadow-slate-800 rounded-lg'>
                    <h3 className="text-2xl font-bold text-black-700">{doctor.name}</h3>
                    <p className="mt-2 text-black-600 font-bold">Specialty: {doctor.specialization}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg font-bold text-neutral-800">Available Dates and Times:</h4>
                    {doctor.availableDates.map((date, index) => (
                      <div key={index} className="mt-2">
                        <p className="font-semibold text-neutral-800">{new Date(date.date).toLocaleDateString()}</p>
                        <ul className="list-disc pl-5 list-none text-neutral-800">
                          {date.times.map((time, idx) => (
                            <li key={idx}>
                              {time.startTime} - {time.endTime}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex space-x-2">
                    {userType == 'admin' && (
                      <>
                        <button
                          onClick={() => handleEditDoctor(doctor._id)}
                          className="px-4 py-1 rounded shadow shadow-slate-800 hover:text-sky-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDoctor(doctor._id)}
                          className="text-red-600 px-4 py-1 rounded shadow shadow-slate-800 hover:bg-red-600 hover:text-slate-100"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-blue-600 text-white p-4 text-center">
        © 2024 Medical Consultation. All rights reserved.
      </footer>
    </div>
  );
};

export default ViewDoctorPage;

