import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
import './AddAnnouncement.css'; 

const EditAnnouncement = ({ isOpen, onRequestClose, announcement, onUpdate }) => {
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [evidence, setEvidence] = useState(null);

    useEffect(() => {
        if (announcement) {
            setTopic(announcement.topic);
            setDescription(announcement.description);
            setEvidence(null); // Reset file input
        }
    }, [announcement]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('topic', topic);
        formData.append('description', description);
        
        // Only append evidence if a new file is selected
        if (evidence) {
            formData.append('evidence', evidence);
        }

        try {
            const response = await axios.put(`${BASE_URL}/update-announcement/${announcement.id}`, formData);
            onUpdate(response.data);
            onRequestClose();
        } catch (error) {
            console.error('Error updating announcement:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-calendar-modal">
            <div className="add-calendar-container">
                <h2 className="form-title">Edit Announcement</h2>
                <div className="calendar-form-frame">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Topic:</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="input-1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="input-1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Evidence (optional):</label>
                            <input
                                type="file"
                                onChange={(e) => setEvidence(e.target.files[0])}
                                className="input-1"
                            />
                        </div>
                        <button type="submit" className="submit-button">Update Announcement</button>
                        <button type="button" onClick={onRequestClose} className="close-button">X</button>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default EditAnnouncement;
