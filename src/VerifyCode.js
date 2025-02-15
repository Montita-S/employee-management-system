import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifyCode.css'; 
const VerifyCode = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    //const correctCode = 'App-Interface-Admin';
    const correctCode = '1';
    const handleVerify = (e) => {
        e.preventDefault();
        if (code === correctCode) {
            sessionStorage.setItem('isVerified', 'true'); 
            navigate('/register');
        } else {
            setError('Incorrect code. Please try again.');
        }
    };

    return (
        <div className="verify-code-container">
            <h2>Enter Access Code</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleVerify}>
                <input
                    type="text"
                    placeholder="Enter code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <button type="submit">Verify</button>
                <div className="register-button2" onClick={() => navigate('/')}>
                    Back to Login
                </div>
            </form>
        </div>
    );
};

export default VerifyCode;
