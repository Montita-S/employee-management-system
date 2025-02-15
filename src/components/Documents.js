import React from 'react';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import './Document.css';

const Documents = () => {
    const navigate = useNavigate();

    const handleAdddoc = () => {
        navigate('/add-doc');
    };

    return (
        <div>
            <Navbar />
            <div className='doc-container'>
            <h2>Document</h2>
            <div className="frame-container" onClick={handleAdddoc} style={{ cursor: 'pointer' }}>
                <img 
                    src="/images/tech.png" 
                    alt="tech"
                    className="add-image"
                />
                <div className="upload-button">
                    Click here to upload your Documents
                </div>
            </div></div>
        </div>
    );
};

export default Documents;
