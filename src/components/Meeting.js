import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditMeetingModal from './EditMeetingModal'; 
import MeetingModal from './MeetingModal'; 
import { BASE_URL } from '../config/apiConfig';
import './Visitor.css'; 
const Meeting = () => {  
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
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const getEmployeeName = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.FirstName} ${employee.LastName}` : null;
    };

    const handleEdit = (meeting) => {
        setSelectedMeeting(meeting);
        setModalType('edit'); 
        setViewMeeting(null); 
    };

    const handleDelete = async (id) => {
       
            try {
                await axios.delete(`${BASE_URL}/delete-meeting/${id}`); 
                setMeetings(meetings.filter(meeting => meeting.id !== id)); 
                alert('Meeting deleted successfully!');
            } catch (error) {
                console.error('Error deleting meeting:', error);
                alert('Failed to delete meeting');
            }
        
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await axios.put(`${BASE_URL}/update-meeting/${id}`, updatedData); 
            setMeetings(meetings.map(meeting => (meeting.id === id ? { ...meeting, ...updatedData } : meeting)));
            alert('Meeting updated successfully!');
            setModalType(null);
            setSelectedMeeting(null);
            setViewMeeting(null);
        } catch (error) {
            console.error('Error updating meeting:', error);
            alert('Failed to update meeting');
        }
    };

    const handleView = (meeting) => {
        setViewMeeting(meeting); 
    };

    const filteredMeetings = meetings
        .filter(meeting => {
            const meetingDate = new Date(meeting.date); 
            if (startDate && endDate) {
                return meetingDate >= new Date(startDate) && meetingDate <= new Date(endDate);
            }
            return selectedDate.toDateString() === meetingDate.toDateString();
        })
        .sort((a, b) => {
            const timeA = a.time_from ? a.time_from.split(':').map(Number) : [0, 0];
            const timeB = b.time_from ? b.time_from.split(':').map(Number) : [0, 0];
            return timeA[0] - timeB[0] || timeA[1] - timeB[1]; 
        });



        const generateDayButtons = () => {
            const buttons = [];
            const currentDate = new Date();
            const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())); 
            for (let i = 0; i < 7; i++) {
                const day = new Date(weekStart);
                day.setDate(weekStart.getDate() + i);
                buttons.push(
                    <button className='weekbutton' key={i} onClick={() => {
                        setSelectedDate(day);
                        setSelectedDateMessage(day.toLocaleDateString('en-US', {
                            weekday: 'long', 
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric' 
                        }));
                    }}>
                         <div className="weekday">
                            <span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span> 
                        </div>
                        <div className="day">
                            <span>{day.toLocaleDateString('en-US', { day: 'numeric' })}</span> 
                        </div>
                    </button>
                );
                
            }
            return buttons;
        };
    
    const buttons = generateDayButtons();
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
    
    return (
        <div>
                <Navbar />
                <div className='visitor-container'>
                    <div>
                        <h3 className='day-mes'>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                        <div>
                            {buttons}
                        </div>
                    </div>

                    <div className="date-inputs">
                        <label htmlFor="startDate">Start Date</label>
                        <input 
                            type="date" 
                            id="startDate" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                        />
                        
                        <label htmlFor="endDate">End Date</label>
                        <input 
                            type="date" 
                            id="endDate" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                        />
                    </div>
                </div>
                <div className="visitor-frame">
                    <div className="visitor-image-container">
                        <img 
                            src="/images/menu.png" 
                            alt="visitor"
                            className="visitor-image"
                        />
                    </div>
                    <div className='visit-inputs'>
                        <div className='visit-mes'>Meeting Room</div>
                        <button className="visit-button" onClick={() => navigate('/add-meeting')}>+</button>
                    </div>

                
                    <div className="visitor-list">
                        {filteredMeetings.map((meeting) => (
                            <div
                                key={meeting.id}
                                className="visitor-card"
                                onClick={() => handleView(meeting)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="visitor-info" >
                                    <div className="meeting-details">
                                        <div className="visitor-info-left">
                                            <img 
                                                src="/images/meet.png" 
                                                alt="meet"
                                                className="visitor-icon"
                                                
                                            />
                                            <div className="visitor-info-left2">
                                                <div>
                                                    <strong>Reservations Name:</strong>{' '}
                                                    {getEmployeeName(meeting.id_employee) ? (
                                                        getEmployeeName(meeting.id_employee)
                                                    ) : (
                                                        <span style={{ color: 'red' }}>Not Found Employee Name</span>
                                                    )}
                                                </div>
                                                <div><img src="/images/bran.png" alt="time" className="pic-from" />{meeting.branch}</div>
                                                <div><img src="/images/ob.png" alt="time" className="pic-from" />{meeting.objective}</div> 
                                                <div><img src="/images/meet2.png" alt="time" className="pic-from" />Meeting {meeting.meeting_room}</div> 
                                                <div><img src="/images/time.png"alt="time" className='pic-from' />{formatDate(meeting.date)} ({formatTime(meeting.time_from)} - {formatTime(meeting.time_to)})</div> 
                                            </div>                  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
                {modalType === 'edit' && selectedMeeting && (
                    <EditMeetingModal 
                        isOpen={!!selectedMeeting} 
                        onRequestClose={() => {
                            setModalType(null); 
                            setSelectedMeeting(null);
                        }} 
                        meeting={selectedMeeting} 
                        onUpdate={handleUpdate}
                        user={user}
                    />
                )}
                {viewMeeting && (
                    <MeetingModal 
                    isOpen={!!viewMeeting}
                    onRequestClose={() => setViewMeeting(null)}
                    meeting={viewMeeting}
                    getEmployeeName={getEmployeeName}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    user={user}  
                    />
                )}
            </div>
        
    );
};

export default Meeting;
