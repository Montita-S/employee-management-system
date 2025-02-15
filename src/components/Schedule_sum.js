import React, { useEffect, useState } from 'react'; 
import { useUser } from '../UserContext'; 
import axios from 'axios'; 
import { BASE_URL } from '../config/apiConfig'; 
import './Schedule.css'; 
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Schedule_sum = () => {  
    const { user } = useUser(); 
    const navigate = useNavigate(); 
    const [employee, setEmployee] = useState(null); 
    const [employees, setEmployees] = useState([]); 
    const [schedules, setSchedules] = useState([]); 
    const [error, setError] = useState('');
    const [selectedSchedule, setSelectedSchedule] = useState(null); 
    const [isPopupOpen, setIsPopupOpen] = useState(false); 
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [searchTerm, setSearchTerm] = useState('');  
    const [meetings, setMeetings] = useState([]);
    const [viewMeeting, setViewMeeting] = useState(null); 
    const [visitors, setVisitors] = useState([]);
    const [modalType, setModalType] = useState(null); 
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [carData, setCarData] = useState([]);
    
    const highPositionTitles = ['chairman', 'manager director', 'general manager', 'director'];
    const filteredEmployees = employees.filter(emp =>
        emp.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        emp.LastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
    
        const fetchAllEmployees = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-employees`);
                const activeEmployees = response.data.filter(emp => !emp.EndDate);
                setEmployees(activeEmployees);
            } catch (error) {
                console.error('Error fetching all employees:', error);
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
    
        const fetchMeetings = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-meeting`); 
                setMeetings(response.data);
            } catch (error) {
                console.error('Error fetching meetings:', error);
            }
        };
        const fetchVisitors = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-visitors`);
                setVisitors(response.data); 
            } catch (error) {
                console.error('Error fetching visitor data:', error);
            }
        };
        const fetchCarData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-car`);
                setCarData(response.data); 
            } catch (error) {
                console.error('Error fetching car data:', error);
            }
        };

        if (user && user.id_employee) {
            fetchEmployeeData();  
            fetchAllEmployees(); 
            fetchSchedules();
            fetchMeetings(); 
            fetchVisitors();
            fetchCarData();
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
    const getEmployeeName = (id_employee) => {
            const employee = employees.find(emp => emp.id_employee === id_employee);
            return employee ? `${employee.FirstName} ${employee.LastName}` : null;
        };
    
    const todayMeet = meetings
        .filter(meeting => {
            const meetingDate = new Date(meeting.date).toDateString();
            return meetingDate === todayDate && getEmployeeName(meeting.id_employee) === `${employee?.FirstName} ${employee?.LastName}`;
        })
        .sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.time_from}`).getTime();
            const timeB = new Date(`1970-01-01T${b.time_from}`).getTime();
            return timeA - timeB;
    });
    const todayVisitor = visitors
        .filter(visitor => {
            const visitorDate = new Date(visitor.date).toDateString();
            return visitorDate === todayDate && getEmployeeName(visitor.id_employee) === `${employee?.FirstName} ${employee?.LastName}`;
        })
        .sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.time_from}`).getTime();
            const timeB = new Date(`1970-01-01T${b.time_from}`).getTime();
            return timeA - timeB;
    });
    
    const mergedTodayEvents = [
        ...todaySchedules.map(schedule => ({
            type: 'Schedule',
            details: schedule.schedule_details,
            time_from: schedule.time_from,
            time_to: schedule.time_to,
            id: schedule.id,
            extra: schedule,
        })),
        ...todayMeet.map(meeting => ({
            type: 'Meeting',
            details: meeting.objective,
            time_from: meeting.time_from,
            time_to: meeting.time_to,
            id: meeting.id,
            extra: meeting,
        })),
        ...todayVisitor.map(visitor => ({
            type: 'Visitor',
            details: visitor.origin,
            time_from: visitor.time_from,
            time_to: visitor.time_to,
            id: visitor.id,
            extra: visitor,
        })),
    ].sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.time_from}`).getTime();
        const timeB = new Date(`1970-01-01T${b.time_from}`).getTime();
        return timeA - timeB;
    });

    return (
        <div>
            {employee ? (
                <div className="leave-requests-container">
                    {mergedTodayEvents.length > 0 ? (
                        mergedTodayEvents.map((event, index) => {
                            const timeFrom = new Date(`1970-01-01T${event.time_from}`).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            });
                            const timeTo = new Date(`1970-01-01T${event.time_to}`).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            });

                            return (
                                <div className="leave-request-frame" key={`${event.type}-${event.id}-${index}`}>
                                    <Link to={`/schedule`} className="no-underline-link">
                                        <div className='sch-inputs'>
                                            <div className='noti-sch'>
                                                <strong>{`${event.type}`}</strong>: {event.details}
                                            </div>
                                            <div className='noti-sch'>{`${timeFrom} - ${timeTo}`}</div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })
                    ) : (
                        null
                    )}
                </div>
            ) : (
               null
            )}
        </div>
    );

};

export default Schedule_sum;
