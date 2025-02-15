import React, { useEffect, useState } from 'react';
import Modal from 'react-modal'; 
import './EditMeetingModal.css'; 
import { useNavigate } from 'react-router-dom';
const EditMeetingModal = ({ isOpen, onRequestClose, meeting, onUpdate,user }) => {
    const [formData, setFormData] = useState({
        id_employee: user.id_employee,
        date: '',
        time_from: '',
        time_to: '',
        job_no: '',
        number_of_meet: '',
        objective: '',
        meeting_room: '',
        branch: '',
        attendees: '',
    });
    const navigate = useNavigate();
    const [selectedBranch, setSelectedBranch] = useState('');

    useEffect(() => {
        if (meeting) {
            setFormData({
                ...meeting,
                date: meeting.date? meeting.date.slice(0, 10) : '',
            });
            setSelectedBranch(meeting.branch); 
        }
    }, [meeting]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleBranchChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedBranch(selectedValue);
        setFormData((prevData) => ({
            ...prevData,
            branch: selectedValue,
            meeting_room: '', 
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedData = { ...formData };

        if (meeting.date && meeting.date.slice(0, 10) === formData.date) {
            delete updatedData.date;
        }
    
        onUpdate(meeting.id, updatedData); 
        onRequestClose();
        
    };
    

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-car-modal">
            <div className="add-calendar-container">
            <h2 className="form-title">Edit Meeting</h2>
            <div className="car-form-frame">
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Employee ID:</label>
                        <input
                            type="text"
                            name="id_employee"
                            value={formData.id_employee}
                            onChange={handleChange}
                            className="input-1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            name="date"
                          
                            onChange={handleChange}
                            className="input-1"
                            
                        />
                    </div>
                    <div className="form-group">
                        <label>Time From:</label>
                        <input
                            type="time"
                            name="time_from"
                            value={formData.time_from}
                            onChange={handleChange}
                            className="input-1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Time To:</label>
                        <input
                            type="time"
                            name="time_to"
                            value={formData.time_to}
                            onChange={handleChange}
                            className="input-1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Job No:</label>
                        <input
                            type="text"
                            name="job_no"
                            value={formData.job_no}
                            onChange={handleChange}
                            className="input-1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Number of Participants:</label>
                        <input
                            type="number"
                            name="number_of_meet"
                            value={formData.number_of_meet}
                            onChange={handleChange}
                            className="input-1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Employee ID for Participants:</label>
                        <input
                            type="text"
                            name="attendees"
                            value={formData.attendees}
                            onChange={handleChange}
                            className="input-1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Objective:</label>
                        <input
                            name="objective"
                            value={formData.objective}
                            onChange={handleChange}
                            className="input-1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Select Branch:</label>
                        <select 
                            value={selectedBranch} 
                            onChange={handleBranchChange} 
                            className="input-1" 
                            required
                        >
                            <option value="Chonburi Head Office">Chonburi Head Office</option>
                            <option value="Pathum Thani Branch">Pathum Thani Branch</option>
                        </select>
                    </div>

                    {selectedBranch && (
                        <div className="form-group">
                            <label>Meeting Room:</label>
                            <select
                                name="meeting_room"
                                value={formData.meeting_room}
                                onChange={handleChange}
                                className="input-1"
                                required
                            >
                                {selectedBranch === 'Chonburi Head Office' && (
                                    <>
                                        <option value="Room Vip">Room Vip</option>
                                        <option value="Room 1">Room 1</option>
                                        <option value="Room 2">Room 2</option>
                                        <option value="Room 3">Room 3</option>
                                    </>
                                )}
                                {selectedBranch === 'Pathum Thani Branch' && (
                                    <>
                                        <option value="Room 1">Room 1</option>
                                    </>
                                )}
                            </select>
                        </div>
                    )}

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

export default EditMeetingModal;
