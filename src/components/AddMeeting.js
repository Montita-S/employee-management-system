import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/apiConfig';
import './AddMeeting.css';

const AddMeeting = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id_employee: user.id_employee,
        date: '',
        time_from: '',
        time_to: '',
        job_no: '',
        number_of_meet: '',
        objective: '',
        meeting_room: '',
        branch: '',
        attendees: []
    });
    const [selectedBranch, setSelectedBranch] = useState('');
    useEffect(() => {
        const newAttendees = Array.from({ length: formData.number_of_meet }, (_, index) => formData.attendees[index] || '');
        setFormData((prevData) => ({
            ...prevData,
            attendees: newAttendees,
        }));
    }, [formData.number_of_meet]);
    const handleAttendeeChange = (e, index) => {
        const { value } = e.target;
        const newAttendees = [...formData.attendees];
        newAttendees[index] = value;
        setFormData((prevData) => ({
            ...prevData,
            attendees: newAttendees,
        }));
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleBranchChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedBranch(selectedValue);
        setFormData((prevData) => ({
            ...prevData,
            branch: selectedValue,
            meeting_room: '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/add-meeting`, formData);
            alert('Meeting information submitted successfully');
            navigate('/meeting');
        } catch (error) {
            console.error('Error submitting meeting information:', error);
            alert('Failed to submit meeting information');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="add-meeting-container">
                <h2 className="form-title">Add Meeting Room</h2>
                <div className="meeting-form-frame">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Date:</label>
                            <input 
                                type="date" 
                                name="date" 
                                value={formData.date} 
                                onChange={handleChange} 
                                className="input-1"
                                required 

                            />
                        </div>

                        <div className="form-group">
                            <label>Time From:</label>
                            <input 
                                type="time" 
                                name="time_from" 
                                value={formData.time_from} 
                                onChange={handleChange} 
                                className="input-1"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Time To:</label>
                            <input 
                                type="time" 
                                name="time_to" 
                                value={formData.time_to} 
                                onChange={handleChange} 
                                className="input-1"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Job No:</label>
                            <input 
                                type="text" 
                                name="job_no" 
                                value={formData.job_no} 
                                onChange={handleChange} 
                                className="input-1"
                                required 
                                placeholder='Enter Job No'
                            />
                        </div>

                        <div className="form-group">
                            <label>Number of Meeting Participants:</label>
                            <input 
                                type="number" 
                                name="number_of_meet" 
                                value={formData.number_of_meet} 
                                onChange={handleChange} 
                                className="input-1"
                                required 
                                placeholder='Enter Number of Meeting Participants'
                            />

                            {formData.attendees.map((attendee, index) => (
                                <div key={index} className="attendee-input">
                                    <input
                                        type="text"
                                        value={attendee}
                                        onChange={(e) => handleAttendeeChange(e, index)}
                                        placeholder={`Employee ID for Participants ${index + 1}`}
                                         className="input-1"
                                    />
                                </div>
                            ))}
                        </div>
                        

                        <div className="form-group">
                            <label>Objective:</label>
                            <input 
                                name="objective" 
                                value={formData.objective} 
                                onChange={handleChange} 
                                className="input-1"
                                required 
                                placeholder='Enter Objective'
                            />
                        </div>

                        <div className="form-group">
                            <label>Select Branch:</label>
                            <select 
                                value={selectedBranch} 
                                onChange={handleBranchChange} 
                                className="input-1"
                                required
                            >
                                <option value="">Select Branch</option>
                                <option value="Chonburi Head Office">Chonburi Head Office</option>
                                <option value="Pathum Thani Branch">Pathum Thani Branch</option>
                            </select>
                        </div>

                        {selectedBranch && (
                            <div className="form-group">
                                <label>Meeting Room:</label>
                                <select 
                                    name="meeting_room" 
                                    value={formData.meeting_room} 
                                    onChange={handleChange} 
                                    className="input-1" 
                                    required
                                >
                                    <option value="">Select Meeting Room</option>
                                    {selectedBranch === 'Chonburi Head Office' && (
                                        <>
                                            <option value="Room Vip">Room Vip</option>
                                            <option value="Room 1">Room 1</option>
                                            <option value="Room 2">Room 2</option>
                                            <option value="Room 3">Room 3</option>
                                        </>
                                    )}
                                    {selectedBranch === 'Pathum Thani Branch' && (
                                        <>
                                            <option value="Room 1">Room 1</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        )}

                        <button type="submit" className="submit-button">Add Meeting Room</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMeeting;