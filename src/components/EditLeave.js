import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import Navbar from '../Navbar';
import { BASE_URL } from '../config/apiConfig';
const EditLeave = () => {
    const { user } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const [leaveData, setLeaveData] = useState({
        leaveId: '',
        remain_day: '',
        remain_hour: '',
    });

    useEffect(() => {
        // Get the leave record from the state passed via the Link
        if (location.state) {
            setLeaveData(location.state.leaveData);
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLeaveData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { leaveId, remain_day, remain_hour } = leaveData;
            await axios.put(`${BASE_URL}/leave-records/${leaveId}`, { remain_day, remain_hour });
            alert('Leave record updated successfully');
            navigate('/leave'); // Redirect to the leave records page
        } catch (error) {
            console.error('Error updating leave record:', error);
            alert('Failed to update leave record');
        }
    };

    return (
        <div>
            <Navbar />
            <h2>Edit Leave Record</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="remain_day">Remaining Days:</label>
                    <input
                        type="number"
                        id="remain_day"
                        name="remain_day"
                        value={leaveData.remain_day}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="remain_hour">Remaining Hours:</label>
                    <input
                        type="number"
                        id="remain_hour"
                        name="remain_hour"
                        value={leaveData.remain_hour}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Update Leave Record</button>
            </form>
        </div>
    );
};

export default EditLeave;
