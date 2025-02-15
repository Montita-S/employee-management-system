import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
import Navbar from '../Navbar';
import './Leave.css'; 
import { useUser } from '../UserContext'; 
const LeaveRequestsTab = () => {
    const { user } = useUser();
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
    const [filteredGroupedData, setFilteredGroupedData] = useState([]); 
    const [employees, setEmployees] = useState([]);
    const [alldayLeaveRequests, setAlldayLeaveRequests] = useState([]); 
    const [branches, setBranches] = useState([]);
    const [activeBranch, setActiveBranch] = useState('');
    const leaveTypes = ['Sick Leave', 'Business Leave (BP)', 'Business Leave (BW)', 'Annual Leave'];
    useEffect(() => {
        const fetchAllDayLeaveRequests = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-allday-leave`);
                setAlldayLeaveRequests(response.data);
            } catch (error) {
                console.error('Error fetching all day leave requests:', error);
            }
        };

        fetchAllDayLeaveRequests();
    }, []);
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
            const matchesBranch = activeBranch
                ? employee && employee.Branch === activeBranch
                : true;
            return matchesMonth && matchesYear && canView&&matchesBranch;
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
    }, [selectedMonth, selectedYear, leaveRequests, employees, user, activeBranch]);

    useEffect(() => {
        const uniqueBranches = [...new Set(employees.map(employee => employee.Branch))];
        setBranches(uniqueBranches);
    }, [employees]);

    useEffect(() => {
        if (alldayLeaveRequests.length > 0 && employees.length > 0) {
            const filtered = alldayLeaveRequests.filter((request) => {
                const employee = employees.find(emp => emp.id_employee === request.employee_id);

                return employee && canViewEmployee(employee) && 
                    (activeBranch === '' || employee.Branch === activeBranch);
            });
    
            const groupedData = filtered.reduce((acc, request) => {
                const key = `${request.employee_id}-${request.year}`;
                if (!acc[key]) {
                    acc[key] = {
                        employee_id: request.employee_id,
                        year: request.year,
                        leaveTotals: {},
                    };
                }
                acc[key].leaveTotals[request.leave_type] = request.total_days;
                return acc;
            }, {});
    
            setFilteredGroupedData(Object.values(groupedData));
        }
    }, [alldayLeaveRequests, employees, activeBranch]);
    
    const groupedData = alldayLeaveRequests.reduce((acc, request) => {
        const key = `${request.employee_id}-${request.year}`;
        if (!acc[key]) {
            acc[key] = {
                employee_id: request.employee_id,
                year: request.year,
                leaveTotals: {},
            };
        }
        acc[key].leaveTotals[request.leave_type] = request.total_days;
        return acc;
    }, {});

    const groupedArray = Object.values(groupedData);
    
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
    const getEmployeeBranch = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? employee.Branch : null;
    };
    const isToday = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        
        return (
            today.getDate() === date.getDate() &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear()
        );
    };
    const isDateInRange = (dateFrom, dateTo) => {
        const today = new Date();
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);

        toDate.setDate(toDate.getDate() + 1);
    
        return today >= fromDate && today < toDate;  
    };
    
    return (
        <div>
            
            <div className='leave-mes'>Summary Leave Requests</div>
            

            <div  className='leave-inputs'>
                
                    <label htmlFor="month-select">Select Month: </label>
                    <select
                        id="month-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        <option value="">All Months</option>
                        {months.map((month, index) => (
                            <option key={index} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
               
                    <label htmlFor="year-select">Select Year: </label>
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">All Year</option>
                        {getUniqueYears().map((year) => (
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
            <div className="leave-mes1">
                {selectedMonth
                    ? `${selectedMonth} Records`
                    : 'All Records'} 
                {selectedYear !== 'All' && ` for ${selectedYear}`}
            </div>
            <div className="table-leave">
                <table className="styled-table2">
                <thead>
                        <tr>
                            <th rowSpan="2" className='table-cell' style={{ width: '7%' }}>
                                Employee Name
                            </th>
                            <th rowSpan="2" className='table-cell' style={{ width: '7%' }}>
                                Employee ID
                            </th>
                            <th rowSpan="2" className='table-cell' style={{ width: '7%' }}>
                                Leave Type
                            </th>
                            <th colSpan="2" className='table-cell' style={{ width: '10%' }}>
                                Date
                            </th>
                            <th colSpan="2" className='table-cell' style={{ width: '7%' }}>
                                Time
                            </th>
                            <th rowSpan="2" className='table-cell' style={{ width: '10%' }}>
                                Reason
                            </th>
                            <th rowSpan="2" className='table-cell' style={{ width: '5%' }}>
                                Evidence
                            </th>
                            <th rowSpan="2" className='table-cell' style={{ width: '10%' }}>
                                Manager Approve 
                            </th>
                            <th rowSpan="2" className='table-cell' style={{ width: '10%' }}>
                                HR Acknowledged
                            </th>
                            {/*<th rowSpan="2" className='table-cell' style={{ width: '5%' }}>
                                Action
                            </th>*/}
                            
                        </tr>

                        <tr>
                            <th style={{ textAlign: 'center', border: '2px solid #010000', width: '10%' }}>
                                From
                            </th>
                            <th style={{ textAlign: 'center', border: '2px solid #010000', width: '10%' }}>
                                To
                            </th>
                            <th style={{ textAlign: 'center', border: '2px solid #010000', width: '7%' }}>
                                From
                            </th>
                            <th style={{ textAlign: 'center', border: '2px solid #010000', width: '7%' }}>
                                To
                            </th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeaveRequests.map((request) => (
                            <tr key={request.id}>
                                <td className='table-cell' style={{ width: '12%' }}>{getEmployeeName(request.id_employee)}</td>
                                <td className='table-cell' style={{ width: '5%' }}>{request.id_employee}</td>
                                <td className='table-cell' style={{ width: '11%' }}>
                                    {request.approved === 'Non Approved' ? (
                                        <span style={{ color: 'red' }}>●</span> 
                                    ) : isDateInRange(request.date_from, request.date_to) ? (
                                        <span style={{ color: 'green' }}>●</span>
                                    ) : (
                                        <span style={{ color: 'gray' }}>●</span> 
                                    )}
                                    {request.leave_type} 
                                </td>
                                {/*
                                <td className='table-cell' style={{ width: '11%' }}>
                                    { isDateInRange(request.date_from, request.date_to) ? (
                                        <span style={{ color: 'green' }}>●</span>
                                    ) : (
                                        <span style={{ color: 'gray' }}>●</span>
                                    )}
                                    {request.leave_type}
                                </td>*/}
                                <td className='table-cell' style={{ width: '4%' }}>{formatDate(request.date_from)}</td>
                                <td className='table-cell' style={{ width: '4%' }}>{formatDate(request.date_to)}</td>
                                <td className='table-cell' style={{ width: '5%' }}>{formatTime(request.time_from) || '-'}</td>
                                <td className='table-cell' style={{ width: '5%' }}>{formatTime(request.time_to) || '-'}</td>
                                <td className='table-cell' style={{ width: '5%' }}>{request.reason}</td>
                                <td className='table-cell' style={{ width: '5%' }}>
                                    {request.evidence_path ? (
                                        <a href={`${BASE_URL}/${request.evidence_path}`} target="_blank" rel="noopener noreferrer">
                                            View Evidence
                                        </a>
                                    ) : (
                                        <span>-</span>
                                    )}
                                </td>
                                <td className='table-cell' style={{ width: '5%' }}>
                                    {request.approved ? (
                                        <div
                                            className={`button ${request.approved === 'Approved' ? 'button-approve2' : 'button-reject'}`}
                                        >
                                            {request.approved}
                                        </div>
                                    ) : (
                                        <p className="button2 button-wait">Wait Approve</p>
                                    )}
                                </td>

                                <td className='table-cell' style={{ width: '5%' }}>
                                    {request.approved_by_me ? (
                                        <p className="button2 button-approve2">HR Acknowledged</p>
                                    ) : (
                                        <p className="button2 button-wait">Wait HR Approve</p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
            <br/>
            {!(['human_resource'].includes(user.role.toLowerCase())) && (
                <div>
                    <div className='leave-mes'>All-Day Leave</div>
                    <div className="table-leave">
                        <table className="styled-table2">
                            <thead>
                                <tr>
                                    <th className='table-cell' style={{ width: '20%' }}>Employee Name</th>
                                    <th className='table-cell' style={{ width: '12%' }}>Employee ID</th>
                                    <th className='table-cell' style={{ width: '12%' }}>Year</th>
                                    {leaveTypes.map((type, index) => (
                                        <th key={index} className='table-cell' style={{ width: '12%' }}>{type}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGroupedData.map((data, index) => (
                                    <tr key={index}>
                                        <td className='table-cell'>{getEmployeeName(data.employee_id)}</td>
                                        <td className='table-cell' style={{ width: '12%' }}>{data.employee_id}</td>
                                        <td className='table-cell' style={{ width: '12%' }}>{data.year}</td>
                                        {leaveTypes.map((type, idx) => (
                                            <td key={idx} className='table-cell' style={{ width: '12%' }}>
                                                {data.leaveTotals[type] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LeaveRequestsTab;
