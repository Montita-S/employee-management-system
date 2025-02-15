import React, { useEffect, useState } from 'react';
import Modal from 'react-modal'; 
import { useUser } from '../UserContext'; 
import './EditVisitorModal.css';

const EditVisitorModal = ({ isOpen, onRequestClose, visitor, onUpdate }) => {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        id_employee: user.id_employee, 
        visitorName: '',
        date: '',
        timeFrom: '',
        timeTo: '',
        jobNo: '',
        numberOfVisitors: '',
        lunch: 'No',
        coffee: 'No',
        objective:'',
        branch:'',
        origin: '', 
    });

    useEffect(() => {
        if (visitor) {
            setFormData({
                id_employee: visitor.id_employee,
                visitorName: visitor.visitor_name,
                date: visitor.date? visitor.date.slice(0, 10) : '',
                timeFrom: visitor.time_from,
                timeTo: visitor.time_to,
                jobNo: visitor.job_no,
                numberOfVisitors: visitor.number_of_visitors,
                lunch: visitor.lunch,
                coffee: visitor.coffee,
                objective: visitor.objective,
                branch: visitor.branch,
                origin: visitor.origin, 
            });
        }
    }, [visitor]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? (checked ? 'Yes' : 'No') : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedVisitorData = {
                ...formData,
                lunch: formData.lunch === 'Yes' ? 'Yes' : 'No',
                coffee: formData.coffee === 'Yes' ? 'Yes' : 'No',
            };
    

            if (visitor.date && formData.date === visitor.date.slice(0, 10)) {
                delete updatedVisitorData.date;
            }
    
            await onUpdate(visitor.id, updatedVisitorData);
            onRequestClose();
        } catch (error) {
            console.error('Error updating visitor information:', error);
            alert('Failed to update visitor information');
        }
    };
    

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-visitor-modal">
            <div className="add-calendar-container">
            <h2 className="form-title">Edit Visitor</h2>
            <div className="visitor-form-frame">
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="visitorName">Visitor Name:</label>
                        <input 
                            type="text" 
                            name="visitorName" 
                            value={formData.visitorName} 
                            onChange={handleChange} 
                            required 
                            className="input-1"
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
                          
                            onChange={handleChange} 
                           
                            className="input-1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="timeFrom">Time From:</label>
                        <input 
                            type="time" 
                            name="timeFrom" 
                            value={formData.timeFrom} 
                            onChange={handleChange} 
                            required 
                            className="input-1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="timeTo">Time To:</label>
                        <input 
                            type="time" 
                            name="timeTo" 
                            value={formData.timeTo} 
                            onChange={handleChange} 
                            required 
                            className="input-1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="jobNo">Job No:</label>
                        <input 
                            type="text" 
                            name="jobNo" 
                            value={formData.jobNo} 
                            onChange={handleChange} 
                            required 
                            className="input-1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="numberOfVisitors">Number of Visitors:</label>
                        <input 
                            type="number" 
                            name="numberOfVisitors" 
                            value={formData.numberOfVisitors} 
                            onChange={handleChange} 
                            required 
                            min="1"
                            className="input-1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="objective">Objective:</label>
                        <input 
                            type="text" 
                            name="objective" 
                            value={formData.objective} 
                            onChange={handleChange} 
                            required 
                            className="input-1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="branch">Branch:</label>
                        <select 
                            name="branch" 
                            value={formData.branch} 
                            onChange={handleChange} 
                            required 
                            className="input-1"
                        >
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
                            Lunch
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                name="coffee" 
                                checked={formData.coffee === 'Yes'} 
                                onChange={handleChange} 
                            />
                            Coffee
                        </label>
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

export default EditVisitorModal;
