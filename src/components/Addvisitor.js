import React, { useState } from 'react';
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/apiConfig';
import './Addvisitor.css'; 

const AddVisitor = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id_employee: user.id_employee,
        visitorName: '',
        date: '',
        timeFrom: '',
        timeTo: '',
        jobNo: '',
        numberOfVisitors: '',
        lunch: '',
        coffee: '',
        objective: '',
        branch: '',
        origin: '', 
    });
    

    const handleChange = (e) => {
        const { name, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? (checked ? 'Yes' : 'No') : e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const visitorData = {
                ...formData,
                lunch: formData.lunch === 'Yes' ? 'Yes' : 'No',
                coffee: formData.coffee === 'Yes' ? 'Yes' : 'No',
                origin: formData.origin,
            };
            

            await axios.post(`${BASE_URL}/add-visitor`, visitorData);
            alert('Visitor information submitted successfully');
            navigate('/visitor'); 
        } catch (error) {
            console.error('Error submitting visitor information:', error);
            alert('Failed to submit visitor information');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="add-visitor-container">
                
                <h2 className="form-title">Add Visitor</h2>
                <div className="visitor-form-frame">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="visitorName">Visitor Name:</label>
                            <input 
                                type="text" 
                                name="visitorName" 
                                value={formData.visitorName} 
                                onChange={handleChange} 
                                className="input-1"
                                required 
                                placeholder='Enter Visitor Name'
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="origin">From:</label>
                            <input 
                                type="text" 
                                name="origin" 
                                value={formData.origin} 
                                onChange={handleChange} 
                                className="input-1"
                                required 
                                placeholder="Visitor  From"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Date:</label>
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
                            <label htmlFor="timeFrom">Time From:</label>
                            <input 
                                type="time" 
                                name="timeFrom" 
                                value={formData.timeFrom} 
                                onChange={handleChange} 
                                className="input-1"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="timeTo">Time To:</label>
                            <input 
                                type="time" 
                                name="timeTo" 
                                value={formData.timeTo} 
                                onChange={handleChange} 
                                className="input-1"
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="jobNo">Job No:</label>
                            <input 
                                type="text" 
                                name="jobNo" 
                                value={formData.jobNo} 
                                onChange={handleChange} 
                                className="input-1"
                                required 
                                placeholder='Enter Job No'
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="numberOfVisitors">Number of Visitors:</label>
                            <input 
                                type="number" 
                                name="numberOfVisitors" 
                                value={formData.numberOfVisitors} 
                                onChange={handleChange} 
                                className="input-1"
                                required 
                                min="1"
                                placeholder='Enter Number of Visitors'
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="objective">Objective:</label>
                            <input 
                                type="text" 
                                name="objective" 
                                value={formData.objective} 
                                onChange={handleChange} 
                                className="input-1"
                                required 
                                placeholder='Enter Objective'
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="branch">Branch:</label>
                            <select 
                                name="branch" 
                                value={formData.branch} 
                                onChange={handleChange} 
                                className="input-1"
                                required
                            >
                                <option value="">Select Branch</option>
                                <option value="Chonburi Head Office">Chonburi Head Office</option>
                                <option value="Pathum Thani Branch">Pathum Thani Branch</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="lunch" 
                                    checked={formData.lunch === 'Yes'} 
                                    onChange={handleChange} 
                                />
                               <span className="checkbox-text">Lunch</span>
                            </label>
                            <label>
                                <input 
                                    type="checkbox" 
                                    name="coffee" 
                                    checked={formData.coffee === 'Yes'} 
                                    onChange={handleChange} 
                                />
                                 <span className="checkbox-text">Coffee</span>
                            </label>
                        </div>

                        <button type="submit" className="submit-button">Add Visitor</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddVisitor;
