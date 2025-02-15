import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './EditCarModal.css'; 

const EditCarModal = ({ isOpen, onRequestClose, car, onUpdate }) => {
    const [formData, setFormData] = useState({
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
        objective:'',
        attendees:''
    });
    
    useEffect(() => {
        if (car) {
            setFormData({
                ...car,
                date_from: car.date_from ? car.date_from.slice(0, 10) : '',
                date_to: car.date_to ? car.date_to.slice(0, 10) : '',
            });
        }
    }, [car]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const updatedCarData = { ...formData };

        if (car.date_from && car.date_from.slice(0, 10) === formData.date_from) {
            delete updatedCarData.date_from; 
        }
        if (car.date_to && car.date_to.slice(0, 10) === formData.date_to) {
            delete updatedCarData.date_to;
        }

        onUpdate(car.id, updatedCarData);
        onRequestClose();
    };
    

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-car-modal">
            <div className="add-calendar-container">
                <h2 className="form-title">Edit Car</h2>
                <div className="car-form-frame">
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Date From: </label>
                            <input type="date" name="date_from"  onChange={handleChange} className="input-1" />
                        </div>
                        <div className="form-group">
                            <label>Date To: </label>
                            <input type="date" name="date_to"  onChange={handleChange} className="input-1" />
                        </div>
                        <div className="form-group">
                            <label>Time From: </label>
                            <input type="time" name="time_from" value={formData.time_from} onChange={handleChange} className="input-1" />
                        </div>
                        <div className="form-group">
                            <label>Time To: </label>
                            <input type="time" name="time_to" value={formData.time_to} onChange={handleChange} className="input-1" />
                        </div>
                        <div className="form-group">
                            <label>Location: </label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-1" />
                        </div>
                        <div className="form-group">
                            <label>Job No: </label>
                            <input type="text" name="job_no" value={formData.job_no} onChange={handleChange} className="input-1" />
                        </div>
                        <div className="form-group">
                            <label>Number of Persons: </label>
                            <input type="number" name="number_of_person" value={formData.number_of_person} onChange={handleChange} className="input-1" />
                        </div>
                        <div className="form-group">
                            <label>Employee ID for Passenger: </label>
                            <input type="text" name="attendees" value={formData.attendees} onChange={handleChange} className="input-1" />
                        </div>
                        
                        <div className="form-group">
                            <label>Objective: </label>
                            <input type="text" name="objective" value={formData.objective} onChange={handleChange} className="input-1" />
                        </div>
                        <div className="form-group">
                            <fieldset>
                                <legend>Driver</legend>
                                <label>
                                    <input type="radio" name="driver" value="Want Driver" checked={formData.driver === 'Want Driver'} onChange={handleChange} />
                                    Want Driver
                                </label>
                                <label>
                                    <input type="radio" name="driver" value="Driver Myself" checked={formData.driver === 'Driver Myself'} onChange={handleChange} />
                                    Driver Myself
                                </label>
                            </fieldset>
                        </div>
                        <div className="form-group">
                            <label>Driver Name: </label>
                            <input type="text" name="driver_name" value={formData.driver_name} onChange={handleChange} className="input-1" />
                        </div>
                        <div className="form-group">
                            <fieldset>
                                <legend>Select Car Type</legend>
                                <label>
                                    <input type="checkbox" value="Manual" checked={formData.select_car.includes('Manual')} onChange={handleSelectCarChange} />
                                    Manual
                                </label>
                                <label>
                                    <input type="checkbox" value="Auto" checked={formData.select_car.includes('Auto')} onChange={handleSelectCarChange} />
                                    Auto
                                </label>
                            </fieldset>
                        </div>
                        <div className="form-group">
                            <label>Type of Car:</label>
                            <select name="type_car" value={formData.type_car} onChange={handleChange} className="input-1">
                                <option value="">Select Type</option>
                                <option value="Truck">Truck (Manual)</option>
                                <option value="Pickup">Pickup (Manual)</option>
                                <option value="Sedan">Sedan (Auto)</option>
                                <option value="Van">Van (Auto)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <h3>Branch</h3>
                            <label>
                                <input type="radio" name="branch" value="Chonburi Head Office" checked={formData.branch === 'Chonburi Head Office'} onChange={handleChange} />
                                Chonburi Head Office
                            </label>
                            <label>
                                <input type="radio" name="branch" value="Pathum Thani Branch" checked={formData.branch === 'Pathum Thani Branch'} onChange={handleChange} />
                                Pathum Thani Branch
                            </label>
                        </div>
                        <div className="form-group">
                            <label>{formData.branch === 'Chonburi Head Office' ? 'Chonburi Head Office Registrations: ' : 'Pathum Thani Branch Registrations: '}</label>
                            <input type="text" name="registration" value={formData.registration} onChange={handleChange} className="input-1" />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="submit-button">Save Changes</button>
                        </div>
                        <button onClick={onRequestClose} className="close-button">X</button>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default EditCarModal;
