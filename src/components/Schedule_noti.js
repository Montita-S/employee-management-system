import React, { useEffect, useState } from 'react'; 
import { useUser } from '../UserContext'; 
import axios from 'axios'; 
import { BASE_URL } from '../config/apiConfig'; 
import './Schedule.css'; 
import { Link } from 'react-router-dom';
const Schedule_noti = () => {  
    const { user } = useUser(); 
    const [employee, setEmployee] = useState(null); 
    const [schedules, setSchedules] = useState([]); 
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/employee-profile/${user.id_employee}`);
                setEmployee(response.data);
            } catch (error) {
                console.error('Error fetching employee data:', error);
                setError('Failed to load employee data.');
            }
        };

        const fetchSchedules = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-schedules`);
                setSchedules(response.data);
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        };

        if (user && user.id_employee) {
            fetchEmployeeData();  
            fetchSchedules(); 
        }
    }, [user]);

    const getTodayDate = () => {
        const today = new Date();
        return today.toDateString(); 
    };

    const todayDate = getTodayDate();

    const todaySchedules = schedules
        .filter(entry => {
            const scheduleDate = new Date(entry.schedule_date).toDateString();
           
            return scheduleDate === todayDate && entry.emp_name === `${employee?.FirstName} ${employee?.LastName}`;
        })
        .sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.time_from}`).getTime();
            const timeB = new Date(`1970-01-01T${b.time_from}`).getTime();
            return timeA - timeB;
        });

    return (
        <div>
            {employee ? (
                <div className="leave-requests-container">
                    {todaySchedules.length > 0 && (
                        <div>
                            <div  className='head-mess10'>Schedule</div>
                        </div>
                     )}
                    {todaySchedules.length > 0 && (
                        todaySchedules.map((entry, index) => {
                            const timeFrom = new Date(`1970-01-01T${entry.time_from}`).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            });
                            const timeTo = new Date(`1970-01-01T${entry.time_to}`).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            });
        
                            const isLocked = entry.schedule_details.toLowerCase().includes('lock');
        
                            const scheduleDetails = isLocked ? (
                                <img
                                    src="/images/lock.png"
                                    alt="Details are locked"
                                    style={{ width: '20px', height: '20px' }}
                                />
                            ) : (
                                <div>{entry.schedule_details}</div>
                            );
        
                            return (
                                <div className="sch-request-frame" key={index}>
                                    <div className='sch-inputs'>
                                        <div className='noti-sch'><strong>{scheduleDetails}</strong></div>
                                        <div className='noti-sch'>{`${timeFrom} - ${timeTo}`}</div>
                                    </div>
                                </div>
                            );
                        })
                    
                    )}
                </div>
            ) : (
                null
            )}
        </div>
    );
};

export default Schedule_noti;
