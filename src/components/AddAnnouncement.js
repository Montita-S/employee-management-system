import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
import './AddAnnouncement.css'; 

const AddAnnouncement = ({ isOpen, onRequestClose }) => {
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [evidence, setEvidence] = useState(null);

    const handleFileChange = (event) => {
        setEvidence(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('topic', topic);
        formData.append('description', description);
        if (evidence) {
            formData.append('evidence', evidence);
        }

        try {
            const response = await axios.post(`${BASE_URL}/add-announcement`, formData);
            alert(response.data.message);
            onRequestClose();
        } catch (error) {
            console.error('Error adding announcement:', error);
            alert('Failed to add announcement');
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-calendar-modal">
            <div className="add-leave-container">
                <h2 className="form-title2">Add Announcement</h2>
                <form onSubmit={handleSubmit} className="calendar-form-frame">
                    <div className="form-group">
                        <label htmlFor="topic">Topic:</label>
                        <input
                            type="text"
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="input-1"
                            required
                            placeholder='Enter Topic'
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-1"
                            required
                            placeholder='Enter Description'
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="evidence">Add File (optional):</label>
                        <input
                            type="file"
                            id="evidence"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="input-1"
                        />
                    </div>
                    <button type="submit" className="submit-button">Add Announcement</button>
                    <button type="button" onClick={onRequestClose} className="close-button">X</button>
                </form>
            </div>
        </Modal>
    );
};

export default AddAnnouncement;
