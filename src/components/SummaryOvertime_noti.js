import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig'; 
import './Leave.css'; 
import { useUser } from '../UserContext'; 
import { Link } from 'react-router-dom';
const SummaryOvertime_noti = () => {
    const { user } = useUser();
    const [overtimeRequests, setOvertimeRequests] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    
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
    

    const getEmployeeName = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.FirstName} ${employee.LastName}` : null;
    };
    const getEmployeeDepartment = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? employee.Department : null;
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    
    return (
        <div>
            <div className="leave-requests-container">
            
                {filteredRequests.map((request) => (
                    <div key={request.id} className="leave-request-frame">  
                        <Link to={`/daily_copy/${request.id_employee}`} className="no-underline-link">        
                            <div>{getEmployeeDepartment(request.id_employee)} - {getEmployeeName(request.id_employee)} ({request.id_employee})</div>
                            <div><strong>Daily Work and Overtime Records</strong></div>
                            <div>{formatDate(request.date)}</div>
                        </Link> 
                    </div>
                ))}
            </div>

        </div>
    );
};

export default SummaryOvertime_noti;
