import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const EditDoctorPage = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [error, setError] = useState('');
    const [availableDates, setAvailableDates] = useState([{ date: '', times: [{ startTime: '', endTime: '' }] }]);

    ///update
    const convertTo12HourFormat = (time) => {
        const [hour, minute] = time.split(':');
        const hourNum = parseInt(hour, 10);
        const isPM = hourNum >= 12;
        const adjustedHour = hourNum % 12 || 12;
        const ampm = isPM ? 'PM' : 'AM';
        return `${adjustedHour}:${minute} ${ampm}`;
    };
    ///

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await fetch(`/api/doctors/${doctorId}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch doctor details');
                }

                const data = await response.json();
                setDoctor(data.doctor);
                setAvailableDates(data.doctor.availableDates);
            } catch (err) {
                console.error('Error fetching doctor details:', err);
                setError('Failed to load doctor details');
            }
        };

        fetchDoctorDetails();
    }, [doctorId]);

    const handleSaveChanges = async (e) => {
        ///
        e.preventDefault();

        const formattedDates = availableDates.map(dateGroup => ({
            date: dateGroup.date,
            times: dateGroup.times.map(slot => ({
                startTime: convertTo12HourFormat(slot.startTime),
                endTime: convertTo12HourFormat(slot.endTime)
            }))
        }));
        ///
        try {
            const response = await fetch(`/api/doctors/${doctorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...doctor, availableDates: formattedDates }),
            });

            if (response.ok) {
                alert('Doctor details updated successfully');
                navigate('/doctors');
            } else {
                alert('Failed to update doctor details');
            }
        } catch (err) {
            console.error('Error updating doctor details:', err);
            alert('Error updating doctor details');
        }
    };

    const handleDateChange = (index, date) => {
        const newDates = [...availableDates];
        newDates[index].date = date;
        setAvailableDates(newDates);
    };

    const handleTimeChange = (dateIndex, timeIndex, field, value) => {
        const newDates = [...availableDates];
        newDates[dateIndex].times[timeIndex][field] = value;
        setAvailableDates(newDates);
    };

    const addDate = () => {
        setAvailableDates([...availableDates, { date: '', times: [{ startTime: '', endTime: '' }] }]);
    };

    const removeDate = (index) => {
        setAvailableDates(availableDates.filter((_, i) => i !== index));
    };

    const addTimeSlot = (dateIndex) => {
        const newDates = [...availableDates];
        newDates[dateIndex].times.push({ startTime: '', endTime: '' });
        setAvailableDates(newDates);
    };

    const removeTimeSlot = (dateIndex, timeIndex) => {
        const newDates = [...availableDates];
        newDates[dateIndex].times = newDates[dateIndex].times.filter((_, i) => i !== timeIndex);
        setAvailableDates(newDates);
    };

    if (error) return <div>{error}</div>;
    if (!doctor) return <div>Loading...</div>;

    return (
        <div className="bg-gray-100 flex flex-col min-h-screen">
            <div className="flex-grow container mx-auto p-6">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">Edit Doctor</h2>
                <form className="bg-white shadow-xl shadow-blue-500 rounded-lg p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
                        <input
                            type="text"
                            value={doctor.name}
                            onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                            className="mt-1 p-2 w-full border rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Specialization</label>
                        <input
                            type="text"
                            value={doctor.specialization}
                            onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })}
                            className="mt-1 p-2 w-full border rounded-md"
                            required
                        />
                    </div>
                    {availableDates.map((dateGroup, dateIndex) => {
                        // Create a valid date object or set to null if invalid
                        const dateValue = new Date(dateGroup.date);
                        const formattedDate = isNaN(dateValue.getTime()) ? '' : dateValue.toISOString().split('T')[0];

                        return (
                            <div key={dateIndex} className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <input
                                        type="date"
                                        value={formattedDate}
                                        onChange={(e) => handleDateChange(dateIndex, e.target.value)}
                                        className="p-2 border rounded-md"
                                        required
                                    />
                                    <button type="button" className="text-red-500 font-bold px-2 py-1 shadow shadow-gray-800 rounded-lg" onClick={() => removeDate(dateIndex)}>Remove Date</button>
                                </div>
                                {dateGroup.times.map((timeSlot, timeIndex) => (
                                    <div key={timeIndex} className="flex items-center space-x-2 mb-2">
                                        <input
                                            type="time"
                                            value={timeSlot.startTime}
                                            onChange={(e) => handleTimeChange(dateIndex, timeIndex, 'startTime', e.target.value)}
                                            className="p-2 border rounded-md"
                                            required
                                        />
                                        <input
                                            type="time"
                                            value={timeSlot.endTime}
                                            onChange={(e) => handleTimeChange(dateIndex, timeIndex, 'endTime', e.target.value)}
                                            className="p-2 border rounded-md"
                                            required
                                        />
                                        <button type="button" className="text-red-500" onClick={() => removeTimeSlot(dateIndex, timeIndex)}>&times;</button>
                                    </div>
                                ))}
                                <button type="button" className="text-blue-700 font-bold px-2 py-1 shadow shadow-gray-800 rounded-lg" onClick={() => addTimeSlot(dateIndex)}>Add Time Slot</button>
                            </div>
                        );
                    })}
                    <div className='flex gap-4 p-2'>
                        <button type="button" className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4" onClick={addDate}>Add Another Date</button>
                        <button type="button" onClick={handleSaveChanges} className="bg-green-500 text-white px-6 py-2 rounded-md mt-4">Save Changes</button>
                    </div>
                </form>
            </div>
            <footer className="bg-blue-600 text-white p-4 text-center">
                © 2024 Medical Consultation. All rights reserved.
            </footer>
        </div>
    );
};

export default EditDoctorPage;
