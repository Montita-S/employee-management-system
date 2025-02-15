import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/apiConfig';
import './AddCar.css';

const AddCar = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id_employee: user.id_employee,
        date_from: '',
        date_to: '',
        time_from: '',
        time_to: '',
        location: '',
        job_no: '',
        number_of_person: '',
        driver: '',
        driver_name: '',
        select_car: '',
        type_car: '',
        registration: '',
        branch: '',
        objective: '',
        attendees: [] 
    });
    
    const [selectedBranch, setSelectedBranch] = useState('');
    useEffect(() => {
        const attendees = Array.from({ length: formData.number_of_person }, (_, i) => formData.attendees[i] || '');
        setFormData((prevData) => ({
            ...prevData,
            attendees: attendees
        }));
    }, [formData.number_of_person]);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? (checked ? value : '') : value,
        }));
    };

    const handleSelectCarChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevData) => {
            let updatedSelectCar = prevData.select_car.split(', ').filter(val => val);
            if (checked) {
                updatedSelectCar.push(value);
            } else {
                updatedSelectCar = updatedSelectCar.filter(val => val !== value);
            }
            return {
                ...prevData,
                select_car: updatedSelectCar.join(', '),
            };
        });
    };
    const handleAttendeeChange = (index, value) => {
        const newAttendees = [...formData.attendees];
        newAttendees[index] = value;
        setFormData((prevData) => ({
            ...prevData,
            attendees: newAttendees,
        }));
    };

    const handleBranchChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedBranch(selectedValue);
        setFormData((prevData) => ({
            ...prevData,
            branch: selectedValue,
            registration: '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/add-car`, formData);
            alert('Car information submitted successfully');
            navigate('/car');
        } catch (error) {
            console.error('Error submitting car information:', error);
            alert('Failed to submit car information');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="add-car-container">
                
                <h2 className="form-title">Add Car Reservation</h2>
                <div className="car-form-frame">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Date From:</label>
                            <input className="input-1" type="date" name="date_from" value={formData.date_from} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Date To:</label>
                            <input className="input-1" type="date" name="date_to" value={formData.date_to} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Time From:</label>
                            <input className="input-1" type="time" name="time_from" value={formData.time_from} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Time To:</label>
                            <input className="input-1" type="time" name="time_to" value={formData.time_to} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Location:</label>
                            <input className="input-1" type="text" name="location" value={formData.location} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Job No:</label>
                            <input className="input-1" type="text" name="job_no" value={formData.job_no} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Number of Persons:</label>
                            <input className="input-1" type="number" name="number_of_person" value={formData.number_of_person} onChange={handleChange} />
                           
                            {formData.attendees.map((attendee, index) => (
                                <div key={index} className="attendee-input">
                                    <input
                                        type="text"
                                        value={attendee}
                                        onChange={(e) => handleAttendeeChange(index, e.target.value)}
                                        placeholder={`Employee ID for Passenger ${index + 1}`}
                                        className="input-1"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="form-group">
                            <label>Objective:</label>
                            <input className="input-1" type="text" name="objective" value={formData.objective} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <fieldset>
                                <legend>Driver</legend>
                                <label>
                                    <input type="radio" name="driver" value="Want Driver" checked={formData.driver === 'Want Driver'} onChange={handleChange} />
                                    <span className="checkbox-text">Want Driver</span>
                                </label>
                                <label>
                                    <input type="radio" name="driver" value="Driver Myself" checked={formData.driver === 'Driver Myself'} onChange={handleChange} />
                                    <span className="checkbox-text">Driver Myself</span>
                                </label>
                            </fieldset>
                        </div>

                        <div className="form-group">
                            <label>Driver Name:</label>
                            <input className="input-1" type="text" name="driver_name" value={formData.driver_name} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <fieldset>
                                <legend>Select Car Type</legend>
                                <label>
                                    <input type="checkbox" value="Manual" checked={formData.select_car.includes('Manual')} onChange={handleSelectCarChange} />
                                    <span className="checkbox-text">Manual</span>
                                </label>
                                <label>
                                    <input type="checkbox" value="Auto" checked={formData.select_car.includes('Auto')} onChange={handleSelectCarChange} />
                                    <span className="checkbox-text">Auto</span>
                                </label>
                            </fieldset>
                        </div>

                        <div className="form-group">
                            <label>Type of Car:</label>
                            <select className="input-1" name="type_car" value={formData.type_car} onChange={handleChange}>
                                <option value="">Select Type</option>
                                <option value="Truck">Truck (Manual)</option>
                                <option value="Pickup">Pickup (Manual)</option>
                                <option value="Sedan">Sedan (Auto)</option>
                                <option value="Van">Van (Auto)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <h3>Registration</h3>
                            <label>
                                <input type="radio" name="branch" value="Chonburi Head Office" checked={selectedBranch === 'Chonburi Head Office'} onChange={handleBranchChange} />
                                <span className="checkbox-text">Chonburi Head Office</span>
                            </label>
                            <label>
                                <input type="radio" name="branch" value="Pathum Thani Branch" checked={selectedBranch === 'Pathum Thani Branch'} onChange={handleBranchChange} />
                                <span className="checkbox-text">Pathum Thani Branch</span>
                            </label>

                            {selectedBranch === 'Chonburi Head Office' && (
                                <select className="input-1" name="registration" value={formData.registration} onChange={handleChange}>
                                    <option value="">Select Registration</option>
                                    <option value="84 7613">84 7613 (Truck)</option>
                                    <option value="3ตล 1829">3ตล 1829 (Pickup)</option>
                                    <option value="3ฒร 7111">3ฒร 7111 (Pickup)</option>
                                    <option value="3ฒฒ 9065">3ฒฒ 9065 (Pickup)</option>
                                    <option value="3ฒท 4644">3ฒท 4644 (Pickup)</option>
                                    <option value="3ฒท 4640">3ฒท 4640 (Pickup)</option>
                                    <option value="9กฉ 5706">9กฉ 5706 (Jazz)</option>
                                    <option value="1ขน 1826">1ขน 1826 (CR-V)</option>
                                    <option value="ฮ 4283">ฮ 4283 (Hyundai)</option>
                                    <option value="1นฉ 7685">1นฉ 7685 (Van)</option>
                                </select>
                            )}
                            {selectedBranch === 'Pathum Thani Branch' && (
                                <select className="input-1" name="registration" value={formData.registration} onChange={handleChange}>
                                    <option value="">Select Registration</option>
                                    <option value="3ขฆ 1004">3ขฆ 1004 (Pickup)</option>
                                    <option value="3ขฆ 6752">3ขฆ 6752 (Pickup)</option>
                                    <option value="3ฒท 3817">3ฒท 3817 (Pickup)</option>
                                    <option value="6กพ 7484">6กพ 7484 (Sedan)</option>
                                </select>
                            )}
                        </div>

                        <button type="submit" className="submit-button">Add Car Reservation</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCar;
