import React, { useState } from 'react';
import Modal from 'react-modal';
import './Visitor.css'; 
import { useUser } from '../UserContext'; 
const VisitorModal = ({ 
    isOpen, 
    onRequestClose, 
    visitor, 
    employeeName, 
    handleEdit, 
    handleDelete,
    userRole
}) => {
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const hasAccess = (requiredRoles) => 
        requiredRoles.includes(user.role) || (user.role === 'asst_manager' && user.department === 'HR/GA');
    const { user } = useUser(); 
    const formatTime = (time) => {
        if (!time) return ''; 
        const [hours, minutes] = time.split(':');
        const formattedHours = hours.padStart(2, '0');
        return `${formattedHours}:${minutes}`;
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    const handleDeleteClick = () => {
        setIsConfirmationVisible(true);
    };

    const handleConfirmDelete = () => {
        handleDelete(visitor.id); 
        setIsConfirmationVisible(false); 
    };

    const handleCancelDelete = () => {
        setIsConfirmationVisible(false); 
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Visitor Details"
            ariaHideApp={false}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
                content: {
                    backgroundColor: '#f0f0f0',
                    color: '#000',
                    borderRadius: '10px',
                    padding: '20px',
                    maxWidth: '600px',
                    margin: 'auto',
                    height:'500px'
                },
            }}
        >
            <div>
                <h2>Visitor</h2>
                <p>
                    <strong>Reservations Name:</strong>{' '}
                    {employeeName ? (
                        employeeName
                    ) : (
                        <span style={{ color: 'red' }}>Not Found Employee Name</span>
                    )}
                </p>

                <p><strong>Visitor Name:</strong> {visitor.visitor_name}</p>
                <p><strong>Date:</strong> {formatDate(visitor.date)}</p>
                <p><strong>Time:</strong> {formatTime(visitor.time_from)} - {formatTime(visitor.time_to)}</p>
                <p><strong>From:</strong> {visitor.origin}</p>
                <p><strong>Job No:</strong> {visitor.job_no}</p>
                <p><strong>Number of Visitors:</strong> {visitor.number_of_visitors}</p>
                <p><strong>Objective:</strong> {visitor.objective}</p>
                <p><strong>Lunch:</strong> {visitor.lunch}</p>
                <p><strong>Coffee:</strong> {visitor.coffee}</p>

                <div className={`${
                                    hasAccess(['human_resource', 'asst_manager']) &&
                                    (user.role !== 'asst_manager' || (user.role === 'asst_manager' && user.department === 'HR/GA'))
                                        ? ''
                                        : 'disabled'
                                }`} style={{ marginRight: "20px" }}>
                        <button onClick={() => handleEdit(visitor)} className="edit-button">Edit</button>
                        {isConfirmationVisible ? (
                            <div className="pop-container">
                                <div className='pop-mes2'>Are you sure you want to delete?</div>
                                <div className='pop-inputs2'>
                                    <button  className="warning-button"  onClick={handleConfirmDelete} style={{ marginLeft: '10px' }}>Yes</button>
                                    <button  className="warning-button2"  onClick={handleCancelDelete} style={{ marginLeft: '10px' }}>No</button>
                                </div>
                            </div>
                        ) : (
                            <button className='delete-button' onClick={handleDeleteClick}>Delete</button>
                        )}
 
                </div>
                
            </div>
        </Modal>
    );
};

export default VisitorModal;
