import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig'; 
import './Leave.css'; 
import { useUser } from '../UserContext'; 
const SummaryOvertimeTab = () => {
    const { user } = useUser();
    const [overtimeRequests, setOvertimeRequests] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [overtimeEntries, setOvertimeEntries] = useState([]);
    const [branches, setBranches] = useState([]);
    const [activeBranch, setActiveBranch] = useState('');
    const handleApprovalToggle = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;

            setOvertimeRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === id ? { ...request, approved: newStatus } : request
                )
            );

            await axios.put(`${BASE_URL}/api/overtime/approve/${id}`, { approved: newStatus });
    
        } catch (error) {
            console.error('Error updating approval status:', error);
        }
    };
    
    
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
        { value: '', label: 'All Months' },
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-employees`);
                setEmployees(response.data);

                const uniqueBranches = [...new Set(response.data.map(emp => emp.Branch))];
                setBranches(uniqueBranches);
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
    const groupRequestsByDate = (requests) => {
        return requests.reduce((groups, request) => {

            const dateObj = new Date(request.date);
            const day = String(dateObj.getDate()).padStart(2, '0'); 
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const date = `${day}/${month}/${year}`;
    
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(request);
            return groups;
        }, {});
    };
    

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
            const matchesBranch = activeBranch
                ? employee && employee.Branch === activeBranch
                : true;
            return matchesMonth && matchesYear && matchesDepartment && canView &&matchesBranch;
        });

        const sortedRequests = filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });

        setFilteredRequests(sortedRequests);
    }, [overtimeRequests, employees, selectedMonth, selectedYear, selectedDepartment, activeBranch]);

    const groupedRequests = groupRequestsByDate(filteredRequests);
    

    const getEmployeeName = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.FirstName} ${employee.LastName}` : null;
    };

    const getEmployeeDepartment = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? employee.Department : null;
    };
    const getEmployeeBranch = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? employee.Branch : null;
    };
    const years = [...new Set(overtimeRequests.map(req => new Date(req.date).getFullYear()))].sort();
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
    const calculateOvertime = (timeFrom, timeTo) => {
        const startTime = new Date(`1970-01-01T${timeFrom}`);
        const endTime = new Date(`1970-01-01T${timeTo}`);
        const eightAM = new Date("1970-01-01T08:00");
        const fivePM = new Date("1970-01-01T17:00");
    
        let overtimeBefore = 0;
        let overtimeAfter = 0;
    
        if (startTime < eightAM) {
            overtimeBefore = (eightAM - startTime) / 1000 / 60;
        }
    
        if (endTime > fivePM) {
            overtimeAfter = (endTime - fivePM) / 1000 / 60;
        }
    
        const totalOvertimeMinutes = overtimeBefore + overtimeAfter;
        const hours = Math.floor(totalOvertimeMinutes / 60);
        const minutes = totalOvertimeMinutes % 60;
    
        return { hours, minutes };
    };
    
    return (
        <div>
            <div className='leave-mes'>Summary Daily Work and Overtime Records</div>
            {user.role === 'admin' && (
                <div  className='leave-inputs1'>
                    <label htmlFor="year-select">Department:  </label>
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <option value="">All Departments</option>
                        {[...new Set(employees
                            .map(emp => emp.Department)
                            .filter(department => department !== null && department.trim() !== '')
                        )].map(department => (
                            <option key={department} value={department}>
                                {department}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            
            <div  className='leave-inputs'>
                <label htmlFor="month-select">Select Month: </label>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
            
            
                <label htmlFor="year-select">Select Year: </label>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="">All Year</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div className="branch-tabs">
                {branches.map((branch) => {
                
                    const canAccessBranch = employees.some(employee => 
                        employee.Branch === branch && canViewEmployee(employee)
                    );

                    return canAccessBranch ? (
                        <button
                            key={branch}
                            className={`branch-tab ${branch === activeBranch ? 'active' : ''}`}
                            onClick={() => setActiveBranch(branch)}
                        >
                            {branch}
                        </button>
                    ) : null; 
                })}
            </div>
            

            <div className="table-leave">
            {Object.entries(groupedRequests).map(([date, requests]) => (
                    <div key={date}>
                        <div className="leave-mes1">{date}</div>
                <table className="styled-table2">
                    <thead>
                        <tr>
                            <th className='table-cell'>Employee Name</th>
                            <th className='table-cell'>ID Employee</th>
                            
                            <th className='table-cell'>Department</th>
                            <th className='table-cell'>Date</th>
                            <th className='table-cell'>Time From</th>
                            <th className='table-cell'>Time To</th>
                            <th className='table-cell2'>Overtime Hour</th>
                            <th className='table-cell'>Job No.</th>
                            <th className='table-cell'>Allowance</th>
                            <th className='table-cell'>Driver</th>
                            {user.role === 'human_resource' && (<th className='table-cell2'>Manager Approved</th>)}
                            {!(['human_resource'].includes(user.role.toLowerCase())) && (<th className='table-cell2'>Manager Approved</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request.id}>
                                <td className='table-cell'>{getEmployeeName(request.id_employee)}</td>
                                <td className='table-cell'>{request.id_employee}</td>
                              
                                <td className='table-cell'>{getEmployeeDepartment(request.id_employee)}</td>
                                <td className='table-cell'>{formatDate(request.date)}</td>
                                <td className='table-cell'>{formatTime(request.time_from)}</td>
                                <td className='table-cell'>{formatTime(request.time_to)}</td>
                                <td className='table-cell2'>
                                    {(() => {
                                        const { hours, minutes } = calculateOvertime(request.time_from, request.time_to);
                                        const hoursDisplay = hours > 0 ? `${hours} h` : '';
                                        const minutesDisplay = minutes > 0 ? `${minutes} m` : '';
                                        const timeDisplay = `${hoursDisplay} ${minutesDisplay}`.trim();
                                        return timeDisplay ? timeDisplay : '-';
                                    })()}
                                </td>

                                <td className='table-cell'>{request.job_no}</td>
                                <td className='table-cell'>{request.allowance ? 'Yes' : '-'}</td>
                                <td className='table-cell'>{request.driver ? 'Yes' : '-'}</td>
                                {user.role === 'human_resource' && (
                                    <td className='table-cell2'>
                                        <span
                                            className={`status-message ${
                                                request.approved ? 'approved' : 'wait-approved'
                                            }`}
                                        >
                                            {request.approved ? 'Approved' : 'Wait Approve'}
                                        </span>
                                    </td>
                                )}
                                {!(['human_resource'].includes(user.role.toLowerCase())) && (
                                    <td className='table-cell2'>
                                        {request.approved ? (
                                            <span className="status-message approved">Approved</span>
                                        ) : (
                                            <label className="checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    checked={request.approved === 1}
                                                    onChange={() => handleApprovalToggle(request.id, request.approved)}
                                                    className="status wait-approved"
                                                />
                                            </label>
                                        )}
                                    </td>
                                )}

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            ))}
          </div>   
        </div>
    );
};

export default SummaryOvertimeTab;
