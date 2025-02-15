import React, { useState } from 'react';
import './popup.css';
import { useUser } from '../UserContext'; 
const Popup = ({ schedule, onClose, onDelete }) => {
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const { user } = useUser(); 
    const handleDeleteClick = () => {
        setIsConfirmationVisible(true);  
    };

    const handleConfirmDelete = () => {
        onDelete(schedule.id); 
        setIsConfirmationVisible(false); 
    };

    const handleCancelDelete = () => {
        setIsConfirmationVisible(false); 
    };

    const formattedDate = new Date(schedule.schedule_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    

    const formattedTimeFrom = new Date(`1970-01-01T${schedule.time_from}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    });

    const formattedTimeTo = new Date(`1970-01-01T${schedule.time_to}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    });
    
    const scheduleDetails = schedule.schedule_details.toLowerCase().includes('lock') ? (
        <img 
            src="/images/lock.png" 
            alt="Details are locked" 
            style={{ width: '20px', height: '20px' }}
        />
    ) : schedule.schedule_details;
    

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <p><strong>Name:</strong> {schedule.emp_name}</p>
                <p><strong>Detail:</strong> {scheduleDetails}</p>
                <p><strong>Time:</strong> {formattedTimeFrom} - {formattedTimeTo}</p>
                
                <button  onClick={onClose}>Close</button>
                
                {isConfirmationVisible ? (
                    <div>
                        <div className='pop-mes'>Are you sure you want to delete?</div>
                        <div className='pop-inputs'>
                            <button   onClick={handleConfirmDelete} style={{ marginLeft: '10px' }}>Yes</button>
                            <button onClick={handleCancelDelete} style={{ marginLeft: '10px' }}>No</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={handleDeleteClick} >Delete</button>
                )}
            </div>
        </div>
    );
};

export default Popup;
