import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
import './AddCalendar.css'; 

const AddCalendar = ({ isOpen, onRequestClose, onEventAdded, selectedDate }) => {
    const [topic, setTopic] = useState('');
    const [dateFrom, setDateFrom] = useState(selectedDate.toISOString().slice(0, 10)); 
    const [dateTo, setDateTo] = useState(''); 
    const [timeFrom, setTimeFrom] = useState('');
    const [timeTo, setTimeTo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/add-calendar`, {
                topic,
                date_from: dateFrom,
                date_to: dateTo || null,
                time_from: timeFrom || null,
                time_to: timeTo || null,
            });
            onEventAdded(response.data);
            onRequestClose(); 
        } catch (error) {
            console.error('Error adding calendar event:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-calendar-modal">
            <div className="add-leave-container">
                <h2 className="form-title3">Add Calendar Event</h2>
                <form onSubmit={handleSubmit} className="leave-form-frame">
                    <div className="form-group">
                        <label>Topic:</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="input-1"
                            required
                            placeholder="Enter Topic"
                        />
                    </div>
                    <div className="form-group">
                        <label>Date From:</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="input-1"
                            required
                            
                        />
                    </div>
                    <div className="form-group">
                        <label>Date To:</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="input-1"
                            
                        />
                    </div>
                    <div className="form-group">
                        <label>Time From:</label>
                        <input
                            type="time"
                            value={timeFrom}
                            onChange={(e) => setTimeFrom(e.target.value)}
                            className="input-1"
                        />
                    </div>
                    <div className="form-group">
                        <label>Time To:</label>
                        <input
                            type="time"
                            value={timeTo}
                            onChange={(e) => setTimeTo(e.target.value)}
                            className="input-1"
                        />
                    </div>
                    <button type="submit" className="submit-button">Add Event</button>
                    <button onClick={onRequestClose}  className="close-button">X</button>
                </form>
                
            </div>
        </Modal>
    );
};

export default AddCalendar;
