import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/apiConfig';
import './AddLeave.css'; 

const AddLeave = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        leave_type: '',
        date_from: '',
        date_to: '',
        time_from: '',
        time_to: '',
        reason: '',
        evidence: null, 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            evidence: e.target.files[0], 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('id_employee', user.id_employee); 
        data.append('leave_type', formData.leave_type);
        data.append('date_from', formData.date_from);
        data.append('date_to', formData.date_to);
        data.append('time_from', formData.time_from);
        data.append('time_to', formData.time_to);
        data.append('reason', formData.reason);
        if (formData.evidence) {
            data.append('evidence', formData.evidence);
        }

        try {
            const response = await axios.post(`${BASE_URL}/add-leave`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
            navigate(`/leave/${user.id_employee}`); 
        } catch (error) {
            console.error('Error adding leave request:', error);
            alert('Failed to add leave request.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className='add-leave-container '>
                <div className="form-title">Add Leave Request</div>
                    <div className="leave-form-frame">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="leave_type">Leave Type:</label>
                                <select name="leave_type" onChange={handleChange} className="input-1" required>
                                    <option value="">Select Leave Type</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Business Leave (BW)">Business Leave(BW)</option>
                                    <option value="Business Leave (BP)">Business Leave (BP)</option>
                                    <option value="Annual Leave">Annual Leave</option>
                                    <option value="Other Leave">Other Leave</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="date_from">Date From:</label>
                                <input type="date" name="date_from" onChange={handleChange} className="input-1" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="date_to">Date To:</label>
                                <input type="date" name="date_to" onChange={handleChange} className="input-1" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="time_from">Time From:</label>
                                <input type="time" name="time_from" onChange={handleChange} className="input-1"  />
                            </div>

                            <div className="form-group">
                                <label htmlFor="time_to">Time To:</label>
                                <input type="time" name="time_to" onChange={handleChange} className="input-1"  />
                            </div>

                            <div className="form-group">
                                <label htmlFor="reason">Reason:</label>
                                <input name="reason" onChange={handleChange} className="input-1" required  placeholder="Enter Reason"></input>
                            </div>

                            {formData.leave_type === 'Sick Leave' && (
                                <div className="form-group">
                                    <label htmlFor="evidence">Upload Evidence (Medical Certificate):</label>
                                    <input type="file" name="evidence" onChange={handleFileChange} className="input-1" />
                                </div>
                            )}

                            {formData.leave_type === 'Business Leave (BP)' && (
                                <div className="form-group">
                                    <label htmlFor="evidence">Upload Evidence (File):</label>
                                    <input type="file" name="evidence" onChange={handleFileChange} className="input-1" />
                                </div>
                            )}

                            <button type="submit" className="submit-button">Submit Leave Request</button>
                        </form>
                </div>
            </div>
        </div>
    );
};

export default AddLeave;
