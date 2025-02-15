import React, { useState } from 'react';
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/apiConfig';

const AddDocuments = () => {  
    const { user } = useUser(); // Assume this provides `id_employee` from context
    const [formData, setFormData] = useState({
        id_employee: user?.id_employee || '',
        topic: '',
        recipient: '',
        evidence: null,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, evidence: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('id_employee', formData.id_employee);
        form.append('topic', formData.topic);
        form.append('recipient', formData.recipient);
        if (formData.evidence) {
            form.append('evidence', formData.evidence);
        }

        try {
            const response = await axios.post(`${BASE_URL}/add-document`, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(response.data.message);
            navigate('/documents'); // Redirect to the documents list page
        } catch (error) {
            console.error('Error adding document:', error);
            setErrorMessage('Failed to add document. Please try again.');
        }
    };

    return (
        <div>
            <Navbar />
            <h2>Add Document</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Topic:</label>
                    <input 
                        type="text" 
                        name="topic" 
                        value={formData.topic} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Recipient:</label>
                    <input 
                        type="text" 
                        name="recipient" 
                        value={formData.recipient} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Upload Evidence:</label>
                    <input 
                        type="file" 
                        name="evidence" 
                        onChange={handleFileChange} 
                    />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button type="submit">Add Document</button>
            </form>
        </div>
    );
};

export default AddDocuments;
