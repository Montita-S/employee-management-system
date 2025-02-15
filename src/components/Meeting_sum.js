import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext'; 

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { BASE_URL } from '../config/apiConfig';
import './Visitor.css'; 
import ViewMeetingModal_sum from './MeetingModal_sum';
const Meeting_sum = () => {  
    const { user } = useUser();
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);  
    const [employees, setEmployees] = useState([]); 
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);  
    const [selectedMeeting, setSelectedMeeting] = useState(null);  
    const [modalType, setModalType] = useState(null);  
    const [viewMeeting, setViewMeeting] = useState(null); 
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [startDate, setStartDate] = useState(''); 
    const [endDate, setEndDate] = useState(''); 

    const [selectedDateMessage, setSelectedDateMessage] = useState(''); 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [meetingResponse, employeeResponse] = await Promise.all([
                    axios.get(`${BASE_URL}/get-meeting`), 
                    axios.get(`${BASE_URL}/get-employees`)
                ]);
                
                setMeetings(meetingResponse.data);
                setEmployees(employeeResponse.data); 
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    const getEmployeeName = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.FirstName} ${employee.LastName}` : null;
    };

    const getEmployeeDepartment = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? employee.Department : 'Unknown Department';
    };

    const filteredMeetings = meetings
        .filter(meeting => {
            const meetDateFrom = new Date(meeting.date).toDateString();
            const todayStr = new Date().toDateString();
            return meetDateFrom === todayStr;
        })
        .filter(meeting => {
            return user.department === getEmployeeDepartment(meeting.id_employee) || ['chairman', 'manager_director', 'director', 'human_resource'].includes(user.role);
        })
        .sort((a, b) => {
            const timeA = a.time_from ? a.time_from.split(':').map(Number) : [0, 0];
            const timeB = b.time_from ? b.time_from.split(':').map(Number) : [0, 0];
            return timeA[0] - timeB[0] || timeA[1] - timeB[1];
        });

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

    if (filteredMeetings.length === 0) {
        return null
    }
    const handleView = (meeting) => {
        setViewMeeting(meeting); 
    };

    return (
        <div>
            <div>
                <div className='head-mess10'>Meeting Room</div>
            </div>
            <div>
                {filteredMeetings.map((meeting) => (
                    <div className="car-request-frame" key={meeting.id}  onClick={() => handleView(meeting)} style={{ cursor: 'pointer' }}>
                        <div className='sch-inputs'>
                           
                                    <div>
                                        <strong>
                                            <img src="/images/user.png" alt="time" className="pic-from" />
                                            {getEmployeeName(meeting.id_employee) ? (
                                                <>
                                                    {getEmployeeName(meeting.id_employee)} ({meeting.branch})
                                                </>
                                            ) : (
                                                <span style={{ color: 'red' }}>
                                                    Not Found Employee Name
                                                </span>
                                            )}
                                             <div><img src="/images/ob.png" alt="objective" className="pic-from" />{meeting.objective}</div>
                                             <div><img src="/images/meet2.png" alt="meeting room" className="pic-from" />Meeting {meeting.meeting_room}</div>
                                            </strong>
                                    </div>
                                        
                                       
                                        <div>
                                            <div>{formatTime(meeting.time_from)}</div>  
                                            <div>{formatTime(meeting.time_to)}</div>
                                        </div>
                                    </div>                  
                                </div>
                          
                ))}
            </div>
            {viewMeeting && (
                    <ViewMeetingModal_sum 
                    isOpen={!!viewMeeting}
                    onRequestClose={() => setViewMeeting(null)}
                    meeting={viewMeeting}
                    getEmployeeName={getEmployeeName}
                    user={user} 
                    />
                )}
        </div>
    );
};

export default Meeting_sum;
