import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css'; 
import axios from 'axios';
import { useUser } from './UserContext'; 
import { BASE_URL } from './config/apiConfig';
import Leave_noti from './components/Leave_noti';
import SummaryOvertime_noti from './components/SummaryOvertime_noti';
import Announcement_noti from './components/Announcement_noti';
import Schedule_sum from './components/Schedule_sum';
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false); 
    const { user } = useUser(); 
    const hasAccess = (requiredRoles) => requiredRoles.includes(user.role);
    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [activeTab, setActiveTab] = useState(''); 

    const [overtimeRequests, setOvertimeRequests] = useState([]);

    const [filteredRequests, setFilteredRequests] = useState([]);

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

    const [schedules, setSchedules] = useState([]); 
    const [meetings, setMeetings] = useState([]);
    const [visitors, setVisitors] = useState([]);
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/employee-profile/${user.id_employee}`);
                setEmployee(response.data);
            } catch (error) {
                console.error('Error fetching employee data:', error);
               
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
        if (user && user.id_employee) {
            fetchEmployeeData();  
            fetchSchedules(); 
            fetchMeetings(); 
            fetchVisitors();
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
    const isToday = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        return (
            today.getFullYear() === date.getFullYear() &&
            today.getMonth() === date.getMonth() &&
            today.getDate() === date.getDate()
        );
    };

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
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-announcements`);
                const announcementsWithFullPath = response.data.map(announcement => ({
                    ...announcement,
                    evidence_path: announcement.evidence_path ? `${BASE_URL}/${announcement.evidence_path}` : null
                }));

                const sortedAnnouncements = announcementsWithFullPath.sort((a, b) => {
                    const dateA = new Date(a.date_added);
                    const dateB = new Date(b.date_added);
                    return dateB - dateA; 
                });

                setAnnouncements(sortedAnnouncements);

                const todayAnnouncements = sortedAnnouncements.filter(announcement =>
                    isToday(announcement.date_added)
                );
                setFilteredAnnouncements(todayAnnouncements);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        fetchAnnouncements();
    }, []);



    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-employees`);
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        const fetchOvertimeRequests = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/overtime-requests`);
                setOvertimeRequests(response.data);
            } catch (error) {
                console.error('Error fetching overtime requests:', error);
            }
        };

        fetchOvertimeRequests();
    }, []);
 
    useEffect(() => {
        const filtered = overtimeRequests.filter((request) => {
            const requestDate = new Date(request.date);
            const matchesMonth = selectedMonth ? requestDate.getMonth() + 1 === parseInt(selectedMonth) : true;
            const matchesYear = selectedYear ? requestDate.getFullYear() === parseInt(selectedYear) : true;
            const employee = employees.find(emp => emp.id_employee === request.id_employee);
            const matchesDepartment = selectedDepartment
                ? employee?.Department === selectedDepartment
                : true;
            const canView = employee ? canViewEmployee(employee) : false;
            if (request.approved && user.role !== 'human_resource') {
                return false;
            }
            
            return matchesMonth && matchesYear && matchesDepartment && canView&& (!request.approved );
        });

        const sortedRequests = filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (dateA.getTime() !== dateB.getTime()) {
                return dateA - dateB;
            }

            const timeA = a.time_from ? parseInt(a.time_from.replace(':', ''), 10) : 0;
            const timeB = b.time_from ? parseInt(b.time_from.replace(':', ''), 10) : 0;
            return timeA - timeB;
        });
    
        setFilteredRequests(sortedRequests);
    }, [overtimeRequests, employees, selectedMonth, selectedYear, selectedDepartment, user]);
    


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-employees`); 
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchEmployees();
    }, []);
//leave------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/leave-requests`);
                setLeaveRequests(response.data);
            } catch (error) {
                console.error('Error fetching leave requests:', error);
            } 
        };

        fetchLeaveRequests();
    }, []);
    useEffect(() => {
        const filtered = leaveRequests.filter((request) => {
            const requestDate = new Date(request.date_from);
            const matchesMonth = selectedMonth 
                ? requestDate.getMonth() === months.indexOf(selectedMonth) 
                : true;
            const matchesYear = selectedYear 
                ? requestDate.getFullYear() === parseInt(selectedYear) 
                : true;
            const employee = employees.find(emp => emp.id_employee === request.id_employee);
            const canView = employee ? canViewEmployee(employee) : false;
            
            if (request.approved && user.role !== 'human_resource') {
                return false;
            }
            
            return matchesMonth && matchesYear && canView && (!request.approved || !request.approved_by_me);
        });
        

        const sorted = filtered.sort((a, b) => {
            const dateA = new Date(a.date_from);
            const dateB = new Date(b.date_from);
    
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA - dateB;
            }

            const timeA = a.time_from ? parseInt(a.time_from.replace(':', ''), 10) : 0;
            const timeB = b.time_from ? parseInt(b.time_from.replace(':', ''), 10) : 0;
            return timeA - timeB;
        });
    
        setFilteredLeaveRequests(sorted);
        
    }, [selectedMonth, selectedYear, leaveRequests, employees, user]);
    const canViewEmployee = (employee) => {
        const { Position } = employee;  
        const { Department } = employee;
        
        if ( user.role === 'human_resource') { //true
            return true  && employee.Position !== 'Department Manager'&& employee.Position !== 'Sec Manager'&& employee.Position !== 'Acting Manager'; 
        }
        
        if (user.role === 'director') { //true
            return  (employee.Department === 'ISO'||  employee.Department === 'Manufacturing'||  employee.Department === 'Design'|| employee.Department === 'Nawanakorn')
                    && employee.Position !== 'Department Manager'&& employee.Position !== 'Sec Manager'&& employee.Position !== 'Acting Manager';
        }
        
        
        if (user.role === 'dept_manager') {

            if (user.department === 'Design') {
                return employee.Department === 'Design' && employee.Position !== 'Department Manager' 
                && employee.Position !== 'Sec Manager'&& employee.Position !== 'Sec Manager';
            }
            if (user.department === 'Electrical') {
                return employee.Department === 'Electrical' && employee.Position !== 'Department Manager';
            }
            if (user.department === 'Mechanical') {
                return employee.Department === 'Mechanical' && employee.Position !== 'Department Manager';
            }
            if (user.department === 'Sales') {
                return (employee.Department === 'Nawanakorn'||employee.Department === 'Sales') 
                && employee.Position !== 'Department Manager'&& employee.Position !== 'Sec Manager'
                        && (employee.Position === 'Acting Manager'||employee.Department === 'Sales'); 
            }
            if (user.department === 'Account') {
                return employee.Department === 'Account' && employee.Position !== 'Department Manager';
            }
            return false;
        }
        
        if (user.role === 'sec_manager') {

            if (user.department === 'Manufacturing') {
                return employee.Department === 'Manufacturing' && employee.Position !== 'Department Manager'&& employee.Position !== 'Sec Manager';
            }
            if (user.department === 'Design') {
                return employee.Department === 'Design' && employee.Position !== 'Department Manager'&& employee.Position !== 'Sec Manager';
            }

            if (user.department === 'Nawanakorn') {
                return employee.Department === 'Nawanakorn' && employee.Position !== 'Department Manager'&& employee.Position !== 'Acting Manager'
                        && employee.Position !== 'Sec Manager'&& (employee.Position==='Supervisor Electrical'|| employee.Position==='Wiring Electrical'
                        || employee.Position==='Programmer Electrical');
            }
            if (user.department === 'Purchase') {
                return employee.Department === 'Purchase' && employee.Position !== 'Department Manager'&& employee.Position !== 'Sec Manager';
            }
            if (user.department === 'HR/GA') {
                return employee.Department === 'HR/GA' && employee.Position !== 'Department Manager'&& employee.Position !== 'Sec Manager';
            }
            return false;
        }
        if (user.role === 'act_manager') {
            if (user.department === 'Nawanakorn') {
                return (employee.Department === 'Nawanakorn'||employee.Department === 'Sales') && employee.Position !== 'Sec Manager'
                        && (employee.Department !== 'Nawanakorn'||employee.Position !== 'Asst Sec Manager')
                        && (employee.Position==='Supervisor Mechanical'|| (employee.Position==='Supervisor'&&employee.Branch==='Pathum Thani Branch')
                        || employee.Position==='Assembly Mechanical'|| employee.Position==='Asst Sec Manager');
            }
            return false;
        }
        if (user.role === 'asst_manager') {
            if (user.department === 'Nawanakorn') {
                return employee.Department === 'Nawanakorn' && employee.Position !== 'Department Manager'&& employee.Position !== 'Acting Manager'
                        && employee.Position !== 'Sec Manager'&& (employee.Position==='Designer Design'|| employee.Position==='Clerk');
            }
            if (user.department === 'HR/GA' &&  employee.Branch === 'Pathum Thani Branch') {
                return employee.Department === 'HR/GA' && employee.Position !== 'Department Manager'&& employee.Position !== 'Acting Manager'
                        && employee.Position !== 'Sec Manager'&& (employee.Position==='Driver'|| employee.Position==='House Keeper');
            }
            if (user.department === 'Account' &&  employee.Branch === 'Pathum Thani Branch') {
                return employee.Department === 'Account' && employee.Position !== 'Department Manager'&& employee.Position !== 'Acting Manager'
                        && employee.Position !== 'Sec Manager'&& (employee.Position==='Supervisor');
            }
            
            return false;
        }

        return false;
    };
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
//----------------------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/employee-profile/${user.id_employee}`);
                setEmployee(response.data);
            } catch (error) {
                console.error('Error fetching employee data:', error);

            }
        };

        if (user && user.id_employee) {
            fetchEmployeeData();  
        }
    }, [user]);

    if (error) return <div>{error}</div>;


    const toggleSidebar = () => {
        setIsOpen(!isOpen); 
    };

    const handleLogout = () => {
        navigate('/');
        setIsOpen(false); 
    };
    const switchTab = (tab) => {
        setActiveTab(tab); 
    };
    return (
        <div>
            <button className="menu-button" onClick={toggleSidebar}>
                {filteredLeaveRequests.length > 0 || filteredRequests.length > 0 || filteredAnnouncements.length > 0
                || todaySchedules.length > 0|| todayMeet.length > 0 || todayVisitor.length > 0? (
                    <div className="leave-requests-count">
                        {filteredLeaveRequests.length + filteredRequests.length + filteredAnnouncements.length+todaySchedules.length+todayMeet.length+todayVisitor.length}
                    </div>
                ) : (
                    <div>☰</div>
                )}
            </button>

            {isOpen && (
                <div className="sidebar-overlay">
                    <div className="sidebar-content">
                        <button onClick={toggleSidebar} className="close-button">
                            X
                        </button>
                        {employee ? (
                            <div className="employee-info-container">
                                <div className="image-frame">
                                    <img
                                        src={`${BASE_URL}/${employee.image_path}`}
                                        alt={`${employee.FirstName} ${employee.LastName}`}
                                        className="employee-image-large1"
                                    />
                                </div>
                                <div className="employee-details1">
                                    
                                    <div>{employee.FirstName} {employee.LastName}</div>
                                    <div>{employee.id_employee} - {employee.Position}</div>
                                    <p>{employee.Branch}</p>
                                </div>
                            </div>
                        ) : (
                            <p></p>
                        )}
                    
                    <div className={`leave-requests-container ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                                            'director','general_manager', 'dept_manager', 
                                                                            'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                                            'human_resource','act_manager']) ? '' : 'disabled'}`}>
                        <div className='tab-display'>
                            {filteredAnnouncements.length > 0 && (
                                <div
                                    className={`leave-tab ${activeTab === 'ann' ? 'active' : ''}`}
                                    onClick={() => switchTab('ann')}
                                >
                                    {filteredAnnouncements.length > 0 ? (
                                        <div className="leave-requests-count2">
                                            {filteredAnnouncements.length}
                                        </div>
                                    ) : (
                                        <div className="leave-requests-count">0</div>
                                    )}
                                    Announcement
                                    <div>⠀ </div>
                                </div>
                            )}
                            {(todaySchedules.length > 0 || todayMeet.length > 0 || todayVisitor.length > 0) && (
                                <div
                                    className={`leave-tab ${activeTab === 'sch' ? 'active' : ''}`}
                                    onClick={() => switchTab('sch')}
                                >
                                    <div className="leave-requests-count2">
                                        {todaySchedules.length + todayMeet.length + todayVisitor.length}
                                    </div>
                                    Schedule
                                    <div>⠀</div>
                                </div>
                            )}

                            {filteredLeaveRequests.length > 0  && (
                                <div>
                                    <div
                                        className={`leave-tab ${activeTab === 'leave' ? 'active' : ''}`}
                                        onClick={() => switchTab('leave')}
                                    >
                                            {filteredLeaveRequests.length > 0  ? (
                                                <div className="leave-requests-count2">
                                                    {filteredLeaveRequests.length}
                                                </div>
                                            ) : (
                                                <div className="leave-requests-count3">0</div>
                                            )}
                                        Leave
                                        <div>⠀ </div>
                                        
                                    </div>
                                    
                                </div>
                            )}
                            {filteredRequests.length > 0 && (
                                <div
                                    className={`leave-tab ${activeTab === 'ot' ? 'active' : ''}`}
                                    onClick={() => switchTab('ot')}
                                >
                                    {filteredRequests.length > 0 ? (
                                        <div className="leave-requests-count2">
                                            {filteredRequests.length}
                                        </div>
                                    ) : (
                                        <div className="leave-requests-count">0</div>
                                    )}
                                    OT
                                    <div>⠀ </div>
                                </div>
                            )}

                            
                        </div></div>
                        {activeTab === 'ann' && <Announcement_noti />}
                        {activeTab === 'leave' && <Leave_noti />}
                            
                        {activeTab === 'ot' && <SummaryOvertime_noti />}
                        {activeTab === 'sch' && <Schedule_sum />}

                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;