import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
import './AddSchedule.css';
import Navbar from '../Navbar';
const AddSchedule = () => {
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleDetails, setScheduleDetails] = useState('');
    const [timeFrom, setTimeFrom] = useState('');
    const [timeTo, setTimeTo] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const empName = location.state?.empName || ''; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/add-schedule`, {
                emp_name: empName,
                schedule_date: scheduleDate,
                schedule_details: scheduleDetails,
                time_from: timeFrom,
                time_to: timeTo,
            });
            navigate('/schedule'); 
        } catch (error) {
            console.error('Error adding schedule:', error);
        }
    };

    return (
        <div>
            <Navbar/>
            <div className="add-schedule-container">
                <h2 className="form-title">Add Schedule</h2>
                <form onSubmit={handleSubmit} className="schedule-form-frame">
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={empName}
                            readOnly
                            className="input-1"
                        />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="input-1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Detail:</label>
                        <input
                            type="text"
                            value={scheduleDetails}
                            onChange={(e) => setScheduleDetails(e.target.value)}
                            className="input-1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Time From:</label>
                        <input
                            type="time"
                            value={timeFrom}
                            onChange={(e) => setTimeFrom(e.target.value)}
                            className="input-1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Time To:</label>
                        <input
                            type="time"
                            value={timeTo}
                            onChange={(e) => setTimeTo(e.target.value)}
                            className="input-1"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Add Schedule</button>
                </form>
            </div>
        </div>
    );
};

export default AddSchedule;
