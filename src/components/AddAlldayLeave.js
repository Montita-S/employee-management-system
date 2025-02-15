import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import { BASE_URL } from '../config/apiConfig';
import './AddAlldayLeave.css'; 
import { useUser } from '../UserContext'; 
const AddAlldayLeave = () => {
    const { user } = useUser();
    const { employeeId } = useParams(); 
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        leave_type: '',
        year: '',
        total_days: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/add-allday-leave`, {
                leave_type: formData.leave_type,
                year: formData.year,
                total_days: formData.total_days,
                employee_id: employeeId, 
            });
            alert(response.data.message);
            navigate('/allem');
        } catch (error) {
            console.error('Error adding all-day leave:', error);
            alert('Failed to add all-day leave.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="add-leave-container">
                
                <h2 className="form-title">Add All-Day Leave</h2>
                <div className="leave-form-frame">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="leave_type">Leave Type:</label>
                            <select 
                                name="leave_type" 
                                className="input-1" 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Select Leave Type</option>
                                <option value="Sick Leave">Sick Leave</option>
                                <option value="Business Leave (BW)">Business Leave (BW)</option>
                                <option value="Business Leave (BP)">Business Leave (BP)</option>
                                <option value="Annual Leave">Annual Leave</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="year">Year:</label>
                            <input
                                type="number"
                                name="year"
                                className="input-1"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="total_days">Total Days:</label>
                            <input
                                type="number"
                                name="total_days"
                                className="input-1"
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </div>

                        <button type="submit" className="submit-button">Submit All-Day Leave</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAlldayLeave;
