import React, { useState,useEffect } from 'react';
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/apiConfig';
import './Feedback.css';
const Feedback = () => {
    const [score, setScore] = useState(0);
    const [comments, setComments] = useState('');
    const [followUp, setFollowUp] = useState('No');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
            if (message) {
                const timer = setTimeout(() => {
                    setMessage('');
                }, 1000);
                return () => clearTimeout(timer); 
            }
        }, [message]);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/feedback`, {
                score,
                comments,
                followUp,
                email: followUp === 'Yes' ? email : null,
            });
            setMessage(response.data.message);

        } catch (error) {
            console.error(error);
            setMessage('Failed to submit feedback.');
        }
    };
    const getEmoji = (value) => {
        switch (value) {
            case 1:
                return '😡'; 
            case 2:
                return '😟'; 
            case 3:
                return '😐';
            case 4:
                return '🙂'; 
            case 5:
                return '😊';
            default:
                return '😐'; 
        }
    };
    return (
        <div>
            <Navbar />
            <div className='feedback-con'>
                <div className="feedback-container">
                    <h2>Feedback</h2>
                    {message && <div className="alert">{message}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="rating-icons">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <span
                                    key={value}
                                    className={`rating-icon ${score === value ? 'selected' : ''}`}
                                    onClick={() => setScore(value)}
                                >
                                    {getEmoji(value)}
                                </span>
                            ))}
                        </div>
                        <textarea
                            placeholder="Enter your comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="feedback-textarea"
                        />

                        <div className="follow-up-section">
                            <label>Would you like to follow up on your feedback?</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="followUp"
                                        value="Yes"
                                        checked={followUp === 'Yes'}
                                        onChange={(e) => setFollowUp(e.target.value)}
                                        className='yes'
                                    />
                                    Yes
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="followUp"
                                        value="No"
                                        checked={followUp === 'No'}
                                        onChange={(e) => setFollowUp(e.target.value)}
                                        className='yes'
                                    />
                                    No
                                </label>
                            </div>
                        </div>

                        {followUp === 'Yes' && (
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="feedback-email"
                            />
                        )}

                        <button type="submit" className="submit-feedback">
                            Submit Feedback
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Feedback;