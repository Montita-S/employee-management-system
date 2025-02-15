import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
import Navbar from '../Navbar';
import './Leave.css'; 
import { useUser } from '../UserContext'; 
import { Link } from 'react-router-dom';
const Leave_noti = () => {
    const { user } = useUser();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [activePopup, setActivePopup] = useState(null);

    const togglePopup = (id) => {
        setActivePopup(activePopup === id ? null : id); 
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
    const getUniqueYears = () => {
        const years = leaveRequests.map(request => new Date(request.date_from).getFullYear());
        return [...new Set(years)];
    };


    const formatTime = (time) => {
        if (!time) return ''; 
        const [hours, minutes] = time.split(':');
        const formattedHours = hours.padStart(2, '0');
        return `${formattedHours}:${minutes}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const getEmployeeName = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.FirstName} ${employee.LastName}` : null; 
    };
    const getEmployeeDepartment = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? employee.Department : null;
    };
    return (
        <div>
            <div className="leave-requests-container">
                
                {filteredLeaveRequests.map((request) => (
                    <div className="leave-request-frame">
                        <Link to={`/leave_copy/${request.id_employee}`} className="no-underline-link">

                        {/*<div className="view-more-button" onClick={() => togglePopup(request.id)}>*/}
                                <div>{getEmployeeDepartment(request.id_employee)} - {getEmployeeName(request.id_employee)} ({request.id_employee})</div>
                                <div><strong>Request {request.leave_type}</strong></div>
                                <span>
                                    {formatDate(request.date_from)}
                                    {request.date_to && request.date_from !== request.date_to && ` - ${formatDate(request.date_to)}`}
                                </span>

                        {/*</div>
                        {activePopup === request.id && (
                            <div className="popup-overlay">
                                <div className="popup-content">
                                    <div className="popup-section">
                                        <span className="label">Date To:</span>
                                        <span>{formatDate(request.date_to)}</span>
                                    </div>
                                    <div className="popup-section">
                                        <span className="label">Time From:</span>
                                        <span>{formatTime(request.time_from) || '-'}</span>
                                    </div>
                                    <div className="popup-section">
                                        <span className="label">Time To:</span>
                                        <span>{formatTime(request.time_to) || '-'}</span>
                                    </div>
                                    <div className="popup-section">
                                        <span className="label">Reason:</span>
                                        <span>{request.reason}</span>
                                    </div>
                                    <div className="popup-section">
                                        <span className="label">Evidence:</span>
                                        <span>
                                            {request.evidence_path ? (
                                                <a href={`${BASE_URL}/${request.evidence_path}`} target="_blank" rel="noopener noreferrer">
                                                    View Evidence
                                                </a>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="popup-section">
                                        <span className="label">Manager Approve:</span>
                                        <span>
                                            {request.approved ? (
                                                <p className="button2 button-approve2">Approved</p>
                                            ) : (
                                                <p className="button2 button-wait">Wait Approve</p>
                                            )}
                                        </span>
                                    </div>
                                    <div className="popup-section">
                                        <span className="label">HR Acknowledged:</span>
                                        <span>
                                            {request.approved_by_me ? (
                                                <p className="button2 button-approve2">HR Acknowledged</p>
                                            ) : (
                                                <p className="button2 button-wait">Wait Acknowledge</p>
                                            )}
                                        </span>
                                    </div>
                    
                                    <button className="close-popup" onClick={() => togglePopup(null)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}*/}
                        </Link>
                    </div>
                
                ))}
            </div>

        </div>
    );
};

export default Leave_noti;
