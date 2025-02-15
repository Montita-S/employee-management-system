import React, { useEffect, useState } from 'react'; 
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import Popup from './Popup'; 
import { BASE_URL } from '../config/apiConfig';
import './Schedule.css'; 
import ViewMeetingModal_sum from './MeetingModal_sum';
import VisitorModal_sum from './VisitorModal_sum'; 
const Schedule = () => {  
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
    

    const getWeekDates = () => {
        const dates = [];
        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayDate = new Date(today.setDate(today.getDate() - dayOfWeek + 1)); 
        for (let i = 0; i < 7; i++) {
            const nextDate = new Date(mondayDate);
            nextDate.setDate(mondayDate.getDate() + i);
            dates.push(nextDate);
        }
        return dates;
    };

    const weekDates = getWeekDates();

    
    const highPositionEmployees = employees
        .filter(employee => highPositionTitles.includes(employee.Position.toLowerCase()))
        .sort((a, b) => {
            const aIndex = highPositionTitles.indexOf(a.Position.toLowerCase());
            const bIndex = highPositionTitles.indexOf(b.Position.toLowerCase());
            return aIndex - bIndex; 
    });

    const groupedEmployees = employees.reduce((groups, employee) => {
        if (!highPositionTitles.includes(employee.Position.toLowerCase())) {
            const { Department, Position } = employee;
            if (!groups[Department]) {
                groups[Department] = {};
            }
            if (!groups[Department][Position]) {
                groups[Department][Position] = [];
            }
            groups[Department][Position].push(employee);
        }
        return groups;
    }, {});

    const handleCellClick = (empName) => {
        navigate(`/add-schedule`, { state: { empName } });
    };

    const renderScheduleDetails = (scheduleEntries, date) => {
        const sortedScheduleEntries = scheduleEntries.sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.time_from}`).getTime();
            const timeB = new Date(`1970-01-01T${b.time_from}`).getTime();
            return timeA - timeB;  
        });
    
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }}>
                {sortedScheduleEntries.map((entry, index) => {
                    const scheduleDate = new Date(entry.schedule_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
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
                    return (
                        <div
                            key={index}
                            style={{
                                borderBottom: '2px solid black',
                                padding: '2px',   
                                fontSize: '16px',
                                width: '135px',   
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                setSelectedSchedule(entry);
                                setIsPopupOpen(true);
                            }}
                        >
                            <div >
                                <div className='sch-inputs'>
                                    <div>
                                        {isLocked ? (
                                            <img src="/images/lock.png" alt="Locked" className="locked-icon" style={{ width: '40px', height: '40px' }} />
                                        ) : (
                                            <img src="/images/unlock.png" alt="Unlocked" className="unlocked-icon" style={{ width: '40px', height: '40px' }} />
                                        )}
                                    </div>
                                    <div>
                                        <div>{`${timeFrom}`}</div>
                                        <div>{`${timeTo}`}</div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderMeetingDetails = (meetings, date) => {
        const getEmployeeName = (id_employee) => {
            const employee = employees.find(emp => emp.id_employee === id_employee);
            return employee ? `${employee.FirstName} ${employee.LastName}` : null;
        };
    
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }}>
                {meetings.filter(meeting => new Date(meeting.date).toDateString() === date.toDateString())
                    .sort((a, b) => {
                        const timeA = new Date(`1970-01-01T${a.time_from}`).getTime();
                        const timeB = new Date(`1970-01-01T${b.time_from}`).getTime();
                        return timeA - timeB; 
                    })
                    .map((meeting, index) => {
                        const timeFrom = new Date(`1970-01-01T${meeting.time_from}`).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        });
                        const timeTo = new Date(`1970-01-01T${meeting.time_to}`).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        });
                        return (
                            <div key={meeting.id} onClick={() => handleView(meeting)}
                                style={{
                                    borderBottom: '2px solid black',
                                    padding: '2px',
                                    fontSize: '16px',
                                    width: '135px',
                                    cursor: 'pointer',
                                }}>
                                <div className='sch-inputs'>
                                    <div>
                                        <div><strong>{`Meeting `}</strong></div>
                                        <div>{`${meeting.objective}`}</div>
                                    </div>
                                    <div>{`${timeFrom}  ${timeTo}`}</div>
                                </div>
                            </div>
                        );
                    })}
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
    
    const renderVisitor = (visitors, date) => {
        const getEmployeeName = (id_employee) => {
            const employee = employees.find(emp => emp.id_employee === id_employee);
            return employee ? `${employee.FirstName} ${employee.LastName}` : null;
        };
        return (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }}>
                {visitors.filter(visitor => new Date(visitor.date).toDateString() === date.toDateString())
                .sort((a, b) => {
                    const timeA = new Date(`1970-01-01T${a.time_from}`).getTime();
                    const timeB = new Date(`1970-01-01T${b.time_from}`).getTime();
                    return timeA - timeB; 
                })
                    .map((visitor, index) => {
                        const timeFrom = new Date(`1970-01-01T${visitor.time_from}`).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        });
                        const timeTo = new Date(`1970-01-01T${visitor.time_to}`).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        });
                        return (
                            <div  key={visitor.id}  onClick={() => handleRowClick(visitor)}
                            style={{
                                borderBottom: '2px solid black',
                                padding: '2px',   
                                fontSize: '16px',
                                width: '135px',   
                                cursor: 'pointer',
                            }}>
                                <div className='sch-inputs' >
                                    <div>
                                        <div><strong>{`Visitor `}</strong></div>
                                        <div>{`${visitor.origin}`}</div>
                                    </div>
                                    <div>{`${timeFrom} ${timeTo}`}</div>
                                </div>
                            </div>
                        );
                    })}
                    {modalType === 'view' && selectedVisitor && (
                        <VisitorModal_sum
                            isOpen={!!selectedVisitor}
                            onRequestClose={() => {
                                setModalType(null);
                                setSelectedVisitor(null);
                            }}
                            visitor={selectedVisitor}
                            employeeName={getEmployeeName(selectedVisitor.id_employee)}
        
                            userRole={user.role}
                        />
                    )}
        
            </div>
        );
    };

    const handleView = (meeting) => {
        setViewMeeting(meeting); 
    };

    const handleRowClick = (visitor) => {
        setSelectedVisitor(visitor);
        setModalType('view'); 
    };

    const closePopup = () => {
        setIsPopupOpen(false); 
        setSelectedSchedule(null); 
    };
    const handleDeleteSchedule = async (scheduleId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/delete-schedule/${scheduleId}`);
            if (response.status === 200) {
                setSchedules(prevSchedules => prevSchedules.filter(sched => sched.id !== scheduleId)); 
                setIsPopupOpen(false);
                alert('Schedule deleted successfully.');
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
            alert('Failed to delete schedule.');
        }
    };
    
    return (
        <div>
            <Navbar />
            <div className='schedule-container'>
            
            {employee && (
                <table className="profile-table">
                    <thead>
                        <tr>
                            <th>{`${weekDates[0].toLocaleString('default', { month: 'long', year: 'numeric' })}`}</th>
                            {weekDates.map((date, index) => (
                                <th key={index}>
                                    <div className={date.toDateString() === new Date().toDateString() ? 'current-date-frame' : ''}>
                                        <div>{date.toLocaleString('en-US', { weekday: 'short' })}</div>
                                        <div>{date.getDate()}</div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={employee.id_employee}>
                            <td
                                onClick={() => handleCellClick(`${employee.FirstName} ${employee.LastName}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                {employee.image_path && (
                                    <img
                                        src={`${BASE_URL}/${employee.image_path}`}
                                        alt={`${employee.FirstName} ${employee.LastName}`}
                                        className="employee-image2"
                                    />
                                )}
                                <div className="employee-info2">
                                    <div>{employee.id_employee} {employee.FirstName}</div>
                                    <div>{employee.Position}</div>
                                </div>
                            </td>
                            {weekDates.map((date, index) => {
                                const scheduleEntries = schedules.filter(sched =>
                                    sched.emp_name === `${employee.FirstName} ${employee.LastName}` &&
                                    new Date(sched.schedule_date).toDateString() === date.toDateString()
                                );

                                const meetingsForDate = meetings.filter(meeting =>
                                    meeting.id_employee === employee.id_employee &&
                                    new Date(meeting.date).toDateString() === date.toDateString()
                                );

                                const visitorForDate = visitors.filter(visitor =>
                                    visitor.id_employee === employee.id_employee &&
                                    new Date(visitor.date).toDateString() === date.toDateString()
                                );

                                const allEntries = [
                                    ...scheduleEntries.map(entry => ({
                                        type: 'schedule',
                                        timeFrom: new Date(`1970-01-01T${entry.time_from}`),
                                        component: renderScheduleDetails([entry], date),
                                    })),
                                    ...meetingsForDate.map(meeting => ({
                                        type: 'meeting',
                                        timeFrom: new Date(`1970-01-01T${meeting.time_from}`),
                                        component: renderMeetingDetails([meeting], date),
                                    })),
                                    ...visitorForDate.map(visitor => ({
                                        type: 'visitor',
                                        timeFrom: new Date(`1970-01-01T${visitor.time_from}`),
                                        component: renderVisitor([visitor], date),
                                    })),
                                ];

                                const sortedEntries = allEntries.sort((a, b) => a.timeFrom - b.timeFrom);

                                return (
                                    <td key={index} className="schedule-cell">
                                        {sortedEntries.length > 0 ? (
                                            <>
                                                {sortedEntries.map((entry, idx) => (
                                                    <div key={idx}>{entry.component}</div>
                                                ))}
                                            </>
                                        ) : (
                                            'No Schedule'
                                        )}
                                    </td>
                                );
                            })}


                        </tr>
                    </tbody>
                </table>
            )}


            {highPositionEmployees.length > 0 && (
                <>
                    <div className='sch-mess'>High-Position Employees</div>  
                    <table className="profile-table">
                        <thead>
                            <tr>
                                <th>{`${weekDates[0].toLocaleString('default', { month: 'long', year: 'numeric' })}`}</th>
                                {weekDates.map((date, index) => (
                                    <th key={index}>
                                        <div className={date.toDateString() === new Date().toDateString() ? 'current-date-frame' : ''}>
                                            <div>{date.toLocaleString('en-US', { weekday: 'short' })}</div>
                                            <div>{date.getDate()}</div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {highPositionEmployees.map(emp => (
                                <tr key={emp.id_employee}>
                                    <td 
                                        onClick={() => handleCellClick(`${emp.FirstName} ${emp.LastName}`)} 
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {emp.image_path && (
                                            <img
                                                src={`${BASE_URL}/${emp.image_path}`}
                                                alt={`${emp.FirstName} ${emp.LastName}`}
                                                className="employee-image2"
                                            />
                                        )}
                                        <div className="employee-info2">
                                            <div>{emp.id_employee} {emp.FirstName}</div>
                                            <div>{emp.Position}</div>
                                        </div>
                                    </td>
                                    {weekDates.map((date, index) => {
                                        const scheduleEntries = schedules.filter(sched =>
                                            sched.emp_name === `${emp.FirstName} ${emp.LastName}` &&
                                            new Date(sched.schedule_date).toDateString() === date.toDateString()
                                        );

                                       
                                        const meetingsForDate = meetings.filter(meeting =>
                                            meeting.id_employee === emp.id_employee &&
                                            new Date(meeting.date).toDateString() === date.toDateString()
                                        );
                                        const visitorForDate = visitors.filter(visitor =>
                                            visitor.id_employee === emp.id_employee &&
                                            new Date(visitor.date).toDateString() === date.toDateString()
                                        );
                                        const allEntries = [
                                            ...scheduleEntries.map(entry => ({
                                                type: 'schedule',
                                                timeFrom: new Date(`1970-01-01T${entry.time_from}`),
                                                component: renderScheduleDetails([entry], date),
                                            })),
                                            ...meetingsForDate.map(meeting => ({
                                                type: 'meeting',
                                                timeFrom: new Date(`1970-01-01T${meeting.time_from}`),
                                                component: renderMeetingDetails([meeting], date),
                                            })),
                                            ...visitorForDate.map(visitor => ({
                                                type: 'visitor',
                                                timeFrom: new Date(`1970-01-01T${visitor.time_from}`),
                                                component: renderVisitor([visitor], date),
                                            })),
                                        ];
                                    
                                        const sortedEntries = allEntries.sort((a, b) => a.timeFrom - b.timeFrom);
                                        
                                        return (
                                            <td key={index} className="schedule-cell">
                                                {sortedEntries.length > 0 ? (
                                                    <>
                                                        {sortedEntries.map((entry, idx) => (
                                                            <div key={idx}>{entry.component}</div>
                                                        ))}
                                                    </>
                                                ) : (
                                                    'No Schedule'
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            
            <div className="department-section"></div>
                <div className='sch-inputs'>
                    <select 
                        value={selectedDepartment} 
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        
                    >
                        <option value="">Select Departments</option>
                        {Object.keys(groupedEmployees).map(department => (
                            <option key={department} value={department}>{department}</option>
                        ))}
                    </select>
                    <div>
                        <div className="search-container">
                            <i className="search-icon2">🔍</i>
                            <input
                                type="text" 
                                placeholder="Search Name" 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                className="search-input2"
                            />
                        </div>
                    </div>
                </div>
                {selectedDepartment && (
                    <div>
                        <div className="sch-mess">{selectedDepartment}</div>
                        {Object.keys(groupedEmployees[selectedDepartment] || {}).map(position => {
                            
                            const filteredEmployees = groupedEmployees[selectedDepartment][position].filter(emp =>
                                emp.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                emp.LastName.toLowerCase().includes(searchTerm.toLowerCase())
                            );

                            if (filteredEmployees.length === 0) {
                                return null;
                            }

                            return (
                                <div key={position}>
                                    <table className="profile-table">
                                        <thead>
                                            <tr>
                                                <th>{`${weekDates[0].toLocaleString('default', { month: 'long', year: 'numeric' })}`}</th>
                                                {weekDates.map((date, index) => (
                                                    <th key={index}>
                                                        <div className={date.toDateString() === new Date().toDateString() ? 'current-date-frame' : ''}>
                                                            <div>{date.toLocaleString('en-US', { weekday: 'short' })}</div>
                                                            <div>{date.getDate()}</div>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredEmployees.map(emp => (
                                                <tr key={emp.id_employee}>
                                                    <td
                                                        onClick={() => handleCellClick(`${emp.FirstName} ${emp.LastName}`)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        {emp.image_path && (
                                                            <img
                                                                src={`${BASE_URL}/${emp.image_path}`}
                                                                alt={`${emp.FirstName} ${emp.LastName}`}
                                                                className="employee-image2"
                                                            />
                                                        )}
                                                        <div className="employee-info2">
                                                            <div>{emp.id_employee} {emp.FirstName}</div>
                                                            <div>{emp.Position}</div>
                                                        </div>
                                                    </td>
                                                    {weekDates.map((date, index) => {
                                                        const scheduleEntries = schedules.filter(sched =>
                                                            sched.emp_name === `${emp.FirstName} ${emp.LastName}` &&
                                                            new Date(sched.schedule_date).toDateString() === date.toDateString()
                                                        );

                                                        const meetingsForDate = meetings.filter(meeting =>
                                                            meeting.id_employee === emp.id_employee &&
                                                            new Date(meeting.date).toDateString() === date.toDateString()
                                                        );

                                                        const visitorForDate = visitors.filter(visitor =>
                                                            visitor.id_employee === emp.id_employee &&
                                                            new Date(visitor.date).toDateString() === date.toDateString()
                                                        );

                                                        const allEntries = [
                                                            ...scheduleEntries.map(entry => ({
                                                                type: 'schedule',
                                                                timeFrom: new Date(`1970-01-01T${entry.time_from}`),
                                                                component: renderScheduleDetails([entry], date),
                                                            })),
                                                            ...meetingsForDate.map(meeting => ({
                                                                type: 'meeting',
                                                                timeFrom: new Date(`1970-01-01T${meeting.time_from}`),
                                                                component: renderMeetingDetails([meeting], date),
                                                            })),
                                                            ...visitorForDate.map(visitor => ({
                                                                type: 'visitor',
                                                                timeFrom: new Date(`1970-01-01T${visitor.time_from}`),
                                                                component: renderVisitor([visitor], date),
                                                            })),
                                                        ];

                                                        const sortedEntries = allEntries.sort((a, b) => a.timeFrom - b.timeFrom);

                                                        return (
                                                            <td key={index} className="schedule-cell">
                                                                {sortedEntries.length > 0 ? (
                                                                    <>
                                                                        {sortedEntries.map((entry, idx) => (
                                                                            <div key={idx}>{entry.component}</div>
                                                                        ))}
                                                                    </>
                                                                ) : (
                                                                    'No Schedule'
                                                                )}
                                                            </td>
                                                        );
                                                    })}

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="sch-margin"></div>
                                </div>
                            );
                        })}
                    </div>
                )}


                <div className="department-section"></div>
        
                {isPopupOpen && selectedSchedule && (
                    <div className="popup-container">
                        <div className="popup-content">
                            <Popup 
                                schedule={selectedSchedule} 
                                onClose={closePopup} 
                                onDelete={handleDeleteSchedule} 
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
    
};

export default Schedule;
