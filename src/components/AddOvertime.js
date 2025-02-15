import React, { useState } from 'react';
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/apiConfig';
import './AddOvertime.css'; 

const AddOvertime = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id_employee: user.id_employee,
        time_from: '',
        time_to: '',
        date: '',
        job_no: '',
        allowance: '',  
        driver: ''      
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAllowanceChange = (e) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            allowance: value,  
        }));
    };

    const handleDriverChange = (e) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            driver: value,  
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/add-overtime`, formData);
            alert('Overtime request submitted successfully');
            navigate(`/daily/${user.id_employee}`); 
            setFormData({
                id_employee: user.id_employee,
                time_from: '',
                time_to: '',
                date: '',
                job_no: '',
                allowance: '',
                driver: ''
            });
        } catch (error) {
            console.log('Error submitting overtime request:', error);
            alert('Failed to submit overtime request');
        }
    };

    return (
        <div>
            <Navbar />
            <div className='add-overtime-container'>
                <h2 className="form-title">Add Overtime for {formData.id_employee}</h2>
                <div className="overtime-form-frame">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="time_from">Time From:</label>
                            <input type="time" name="time_from" onChange={handleChange} className="input-1" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="time_to">Time To:</label>
                            <input type="time" name="time_to" onChange={handleChange} className="input-1" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Date:</label>
                            <input type="date" name="date" onChange={handleChange} className="input-1" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="job_no">Job No:</label>
                            <input type="text" name="job_no" onChange={handleChange} className="input-1" required  placeholder='Enter Job No'/>
                        </div>

                        <div className="form-group">
                            <h3>Allowance</h3>
                            <div className="custom-radio-group">
                                <label className="custom-radio">
                                    <input
                                        type="radio"
                                        name="allowance"
                                        value="In-Out"
                                        onChange={handleAllowanceChange}
                                    />
                                    <span className="radio-btn"></span>
                                    <span className="radio-label">In - Out</span>
                                </label>
                                <label className="custom-radio">
                                    <input
                                        type="radio"
                                        name="allowance"
                                        value="Pass Night"
                                        onChange={handleAllowanceChange}
                                    />
                                    <span className="radio-btn"></span>
                                    <span className="radio-label">Pass Night</span>
                                </label>
                            </div>
                        </div>



                        <div className="form-group">
                            <h3>Driver</h3>
                            <div className="custom-radio-group2">
                                <label className="custom-radio">
                                    <input
                                        type="radio"
                                        name="driver"
                                        value="Yes"
                                        onChange={handleDriverChange}
                                    />
                                    <span className="radio-btn"></span>
                                    <span className="radio-label">Yes</span>
                                </label>
                                <label className="custom-radio">
                                    <input
                                        type="radio"
                                        name="driver"
                                        value="No"
                                        onChange={handleDriverChange}
                                    />
                                    <span className="radio-btn"></span>
                                    <span className="radio-label">No</span>
                                </label>
                            </div>
                        </div>


                        <button type="submit" className="submit-button">Submit Overtime</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddOvertime;
