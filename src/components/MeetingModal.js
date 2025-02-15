import React, { useState } from 'react';
import Modal from 'react-modal';
import './Visitor.css'; 
import { useUser } from '../UserContext'; 
const ViewMeetingModal = ({
    isOpen,
    onRequestClose,
    meeting,
    getEmployeeName,
    handleEdit,
    handleDelete,
    user,
}) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const hasAccess = (requiredRoles) => 
        requiredRoles.includes(user.role) || (user.role === 'asst_manager' && user.department === 'HR/GA');

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
        setShowConfirmation(true);
    };

    const handleConfirmDelete = () => {
        handleDelete(meeting.id); 
        setShowConfirmation(false); 
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false); 
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
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
                    height: '500px',
                },
            }}
        >
            <h2>Meeting Room</h2>
            <p>
                <strong>Reservations Name:</strong>{' '}
                {getEmployeeName(meeting.id_employee) ? (
                    getEmployeeName(meeting.id_employee)
                ) : (
                    <span style={{ color: 'red' }}>Not Found Employee Name</span>
                )}
            </p>

            <p><strong>Employee ID:</strong> {meeting.id_employee}</p>
            <p><strong>Date:</strong> {formatDate(meeting.date)}</p>
            <p><strong>Time:</strong> {formatTime(meeting.time_from)} - {formatTime(meeting.time_to)}</p>
            <p><strong>Job No:</strong> {meeting.job_no}</p>
            <p><strong>Branch:</strong> {meeting.branch}</p>
            <p><strong>Meeting Room:</strong> {meeting.meeting_room}</p>
            <p><strong>Number of Participants:</strong> {meeting.number_of_meet}</p>
            {meeting.attendees && (
                <p><strong>Employee ID for Participants:</strong> {meeting.attendees}</p>
            )}

            <p><strong>Objective:</strong> {meeting.objective}</p>
            
           
            
            <div className={`${
                                hasAccess(['human_resource', 'asst_manager']) &&
                                (user.role !== 'asst_manager' || (user.role === 'asst_manager' && user.department === 'HR/GA'))
                                    ? ''
                                    : 'disabled'
                            }`} style={{ marginRight: "20px" }}>
                <div style={{ marginRight: '20px' }}>
                    <button
                        className="edit-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(meeting);
                        }}
                    >
                        Edit
                    </button>

                    {showConfirmation ? (
                        <div className="pop-container">
                            
                            <div className='pop-mes2'>Are you sure you want to delete?</div>
                            <div className='pop-inputs2'>
                                <button
                                    className="warning-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleConfirmDelete();
                                    }}
                                    style={{ marginRight: '10px' }}
                                >
                                    Yes
                                </button>
                                <button
                                    className="warning-button2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelDelete();
                                    }}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="delete-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick();
                            }}
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            
        </Modal>
    );
};

export default ViewMeetingModal;
