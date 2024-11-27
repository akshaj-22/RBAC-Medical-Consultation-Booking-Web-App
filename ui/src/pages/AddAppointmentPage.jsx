import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const AddAppointmentPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors", {
          method: "GET",
          credentials: "include", // Include cookies with the request
        });

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();
        setDoctors(data.doctors); // Set the doctors state
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors");
      }
    };

    fetchDoctors();
  }, []);

  // Handle doctor selection
  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctorId);

    const doctor = doctors.find((doc) => doc._id === doctorId);
    if (doctor) {
      setAvailableDates(doctor.availableDates);
      setAvailableTimes([]);
      setSelectedDate("");
    }
  };

  // Handle date selection
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    const doctor = doctors.find((doc) => doc._id === selectedDoctor);
    if (doctor) {
      const selectedDateInfo = doctor.availableDates.find(
        (d) => new Date(d.date).toISOString().split("T")[0] === date
      );
      if (selectedDateInfo) {
        setAvailableTimes(selectedDateInfo.times);
      }
    }
  };

  // Handle time selection
  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const doctor = doctors.find((doc) => doc._id === selectedDoctor);

      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies with the request
        body: JSON.stringify({
          doctorName: doctor.name,
          date: selectedDate,
          time: selectedTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule appointment");
      }

      const result = await response.json();
      setMessage("Appointment scheduled successfully");
      setError("");
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      setError("Failed to schedule appointment");
      setMessage("");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-sky-300">
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 shadow-2xl shadow-blue-800 rounded-xl max-w-2xl w-full bg-opacity-70 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gradient bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text mb-6">
            Schedule an Appointment
          </h2>
          {message && <p className="text-green-600 mb-4">{message}</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                className="block text-gray-600 font-semibold mb-1"
                htmlFor="doctor"
              >
                Select Doctor
              </label>
              <div className="relative">
                <select
                  id="doctor"
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-300"
                  onChange={handleDoctorChange}
                  value={selectedDoctor}
                  required
                >
                  <option disabled value="">
                    Select a Doctor
                  </option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-5">
              <label
                className="block text-gray-600 font-semibold mb-1"
                htmlFor="date"
              >
                Select Date
              </label>
              <div className="relative">
                <select
                  id="date"
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-300"
                  onChange={handleDateChange}
                  value={selectedDate}
                  required
                >
                  <option disabled value="">
                    Select a Date
                  </option>
                  {availableDates.map((dateInfo) => (
                    <option
                      key={dateInfo.date}
                      value={new Date(dateInfo.date).toISOString().split("T")[0]}
                    >
                      {new Date(dateInfo.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-5">
              <label
                className="block text-gray-600 font-semibold mb-1"
                htmlFor="time"
              >
                Select Time
              </label>
              <div className="relative">
                <select
                  id="time"
                  className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-300"
                  onChange={handleTimeChange}
                  value={selectedTime}
                  required
                >
                  <option disabled value="">
                    Select a Time
                  </option>
                  {availableTimes.map((time, index) => (
                    <option
                      key={index}
                      value={`${time.startTime} - ${time.endTime}`}
                    >
                      {time.startTime} - {time.endTime}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg font-semibold shadow-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 focus:outline-none"
            >
              Schedule
            </button>
          </form>
        </div>
      </main>
      <footer className="bg-blue-600 text-white p-4 text-center">
        © 2024 Medical Consultation. All rights reserved.
      </footer>
    </div>
  );
};

export default AddAppointmentPage;

