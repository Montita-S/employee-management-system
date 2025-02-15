import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../Navbar';
import { useUser } from '../UserContext'; 
import { Link } from 'react-router-dom'; 
import '../Allem.css'; 
import { BASE_URL } from '../config/apiConfig';
import axios from 'axios';
const Allem = () => { 
    const { user } = useUser();
    const [employees, setEmployees] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [selectedBranch, setSelectedBranch] = useState('All');
    const [searchTerm, setSearchTerm] = useState(''); 

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
    const [filteredGroupedData, setFilteredGroupedData] = useState([]); 

    const [alldayLeaveRequests, setAlldayLeaveRequests] = useState([]); 

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
    
    const departments = Array.from(
        new Set(
            employees
                .map(employee => employee.Department)
                .filter(department => department && department.trim() !== '') 
        )
    ).sort();

    const branches = Array.from(
        new Set(
            employees
                .map(employee => employee.Branch)
                .filter(branch => branch && branch.trim() !== '')
        )
    ).sort();


    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await fetch(`${BASE_URL}/get-employees`); 
            const data = await response.json();
            const activeEmployees = data.filter(employee => !employee.EndDate);
            setEmployees(activeEmployees);
        };

        fetchEmployees();
    }, []);

    const highPositionTitles = ['chairman', 'manager director', 'general manager', 'director'];
    const highPositionEmployees = employees
        .filter(employee => highPositionTitles.includes(employee.Position.toLowerCase()))
        .sort((a, b) => {
            const aIndex = highPositionTitles.indexOf(a.Position.toLowerCase());
            const bIndex = highPositionTitles.indexOf(b.Position.toLowerCase());
            return aIndex - bIndex; 
    });
    const filteredEmployees = employees.filter(employee => 
        employee.FirstName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedEmployees = filteredEmployees.reduce((groups, employee) => {
        if (!highPositionTitles.includes(employee.Position.toLowerCase())) {
            const { Department } = employee;
            if (!groups[Department]) {
                groups[Department] = [];
            }
            groups[Department].push(employee);
        }
        return groups;
    }, {});
    const roleHierarchy = ['admin', 'chairman', 'manager_director', 'director', 'general_manager', 'dept_manager', 'sec_manager', 'asst_manager', 'supervisor', 'employee','human_resource'];

    const canViewEmployee = (employee) => {
        const { Position } = employee;  
        const { Department } = employee;
        
        if (user.role === 'admin' || user.role === 'chairman'|| user.role === 'human_resource') { //true
            return true; 
        }
        
        if (user.role === 'manager_director') { //true
            return Position !== 'Chairman'&& employee.Position !== 'Manager Director';
        }
        
        if (user.role === 'general_manager') { //ออกแล้ว
            return  employee.Department === 'Nawanakorn';
        }

        if (user.role === 'director') { //true
            return  employee.Department === 'ISO'||  employee.Department === 'Manufacturing'||  employee.Department === 'Design'|| employee.Department === 'Nawanakorn';
        }
       
        
        if (user.role === 'dept_manager') {

            if (user.department === 'Design') {
                return employee.Department === 'Design' && employee.Position !== 'Department Manager';
            }
            if (user.department === 'Electrical') {
                return employee.Department === 'Electrical' && employee.Position !== 'Department Manager';
            }
            if (user.department === 'Mechanical') {
                return employee.Department === 'Mechanical' && employee.Position !== 'Department Manager';
            }
            if (user.department === 'Sales') {
                return (employee.Department === 'Nawanakorn'||employee.Department === 'Sales') && employee.Position !== 'Department Manager'
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

        /*
        if (user.role === 'dept_manager') { 
            if (Department === 'Design') {
                return employee.Department === 'Design'&& user.role !== 'dept_manager'; 
            }
            return false; 
        }
        if (user.role === 'dept_manager') {
            if (Department === 'Electrical') {
                return employee.Department === 'Electrical'&& user.role !== 'dept_manager'; 
            }
            return false; 
        }
        if (user.role === 'dept_manager') {
            if (Department === 'Mechanical') {
                return employee.Department === 'Mechanical'&& user.role !== 'dept_manager'; 
            }
            return false; 
        }
        if (user.role === 'dept_manager') {
            if (Department === 'Sales') {
                return employee.Department === 'Sales' && user.role !== 'dept_manager'; 
            }
            return false; 
        }
        if (user.role === 'dept_manager') {
            if (Department === 'Account') {
                return employee.Department === 'Account'; 
            }
            return false; 
        }
        if (user.role === 'sec_manager') {
            if (Department === 'Manufacturing') {
                return employee.Department === 'Manufacturing'; 
            }
            return false; 
        }
        if (user.role === 'sec_manager') {
            if (Department === 'Design') {
                return employee.Department === 'Design'&& user.role !== 'dept_manager'; 
            }
            return false; 
        }
        if (user.role === 'sec_manager') {
            if (Department === 'Sales') {
                return employee.Department === 'Sales' &&  user.role !== 'dept_manager'; 
            }
            return false; 
        }
        if (user.role === 'sec_manager') {
            if (Department === 'Nawanakorn') {
                return employee.Department === 'Nawanakorn' &&  user.role !== 'act_manager'; 
            }
            return false; 
        }
        if (user.role === 'act_manager') {
            if (Department === 'Nawanakorn') {
                return employee.Department === 'Nawanakorn'&&  user.role !== 'sec_manager' ; 
            }
            return false; 
        }
        if (user.role === 'sec_manager') {
            if (Department === 'Purchase') {
                return employee.Department === 'Purchase'; 
            }
            return false; 
        }
        if (user.role === 'sec_manager') {
            if (Department === 'HR/GA') {
                return employee.Department === 'HR/GA'; 
            }
            return false; 
        }
        if (user.role === 'asst_manager') {
            if (Department === 'Nawanakorn') {
                return employee.Department === 'Nawanakorn' &&  user.role !== 'sec_manager' && employee.Position === 'Designer'&&  user.role !== 'act_manager'; 
            }
            return false; 
        }
        if (user.role === 'asst_manager') {
            if (Department === 'HR/GA') {
                return employee.Department === 'HR/GA' &&  user.role !== 'sec_manager' && employee.Position === 'Driver'&& employee.branch === 'Pathum Thani Branch'; 
            }
            return false; 
        }*/

        //-----------------------------------------------------------------------------------------------------------------------------
       /* if (employee.Department === 'Design' && user.role === 'dept_manager') {
            return  employee.Department === 'Design' && Position !== 'Dept. Manager'  ;
        }
        if (employee.Department === 'Electrical' && user.role === 'dept_manager') {
            return  employee.Department === 'Electrical' && Position !== 'Dept. Manager';
        }
        if (employee.Department === 'Mechanical' && user.role === 'dept_manager') {
            return  employee.Department === 'Mechanical' && Position !== 'Dept. Manager';
        }
        if (employee.Department === 'Sales' && user.role === 'dept_manager') {
            return  employee.Department === 'Sales' && Position !== 'Dept. Manager';
        }
        if (employee.Department === 'Account' && user.role === 'dept_manager') {
            return  employee.Department === 'Account' && Position !== 'Dept. Manager';
        }
        if (employee.Department === 'Manufacturing' && user.role === 'sec_manager') {
            return  employee.Department === 'Manufacturing' && Position !== 'Sec. Manager' ;
        }
        if (employee.Department === 'Design' && user.role === 'sec_manager') {
            return  employee.Department === 'Design' && Position !== 'Sec. Manager'&& Position !== 'Dept. Manager' ;
        }
        if (employee.Department === 'Sales' && user.role === 'sec_manager') {
            return  employee.Department === 'Sales' && Position !== 'Sec. Manager'&& Position !== 'Dept. Manager' ;
        }
        if (employee.Department === 'Nawanakorn' && user.role === 'sec_manager') {
            return  employee.Department === 'Nawanakorn' && Position !== 'Sec. Manager'&& Position !== 'Dept. Manager' ;
        }
        if (employee.Department === 'Nawanakorn' && user.role === 'act_manager') {
            return  employee.Department === 'Nawanakorn' && Position !== 'Sec. Manager'&& Position !== 'Acting Manager' ;
        }
        if (employee.Department === 'Purchase' && user.role === 'sec_manager') {
            return  employee.Department === 'Purchase' && Position !== 'Sec. Manager' ;
        }
        if (employee.Department === 'HR/GA' && user.role === 'sec_manager') {
            return  employee.Department === 'HR/GA' && Position !== 'Sec. Manager' ;
        }
        if (employee.Department === 'Manufacturing' && user.role === 'asst_manager') {
            return  employee.Department === 'Manufacturing' && Position !== 'Sec. Manager'&& Position !== 'Asst. Sec Manager';
        }
        if (employee.Department === 'Sales' && user.role === 'asst_manager') {
            return  employee.Department === 'Sales' && Position !== 'Sec. Manager'&& Position !== 'Asst. Sec Manager'&& Position !== 'Dept. Manager';
        }
        if (employee.Department === 'Nawanakorn' && user.role === 'asst_manager') {
            return  employee.Department === 'Nawanakorn' && Position !== 'Sec. Manager'&& Position !== 'Acting Manager';
        }
        if (employee.Department === 'HR/GA' && user.role === 'asst_manager') {
            return  employee.Position === 'Driver Nawanakorn' && Position !== 'Sec. Manager';
        }
        if (employee.Department === 'Account' && user.role === 'asst_manager') {
            return  employee.Department === 'Account' && Position !== 'Dept. Manager';
        }
        if (employee.Department === 'Manufacturing' && user.role === 'supervisor' && employee.Position === 'Planner1') {
            return employee.Position === 'Sub-Out';
        }
        if (employee.Department === 'Manufacturing' && user.role === 'supervisor' && employee.Position === 'Program') {
            return employee.Position === 'Machinist' && employee.Position === 'Cutting';
        }
        if (employee.Department === 'Manufacturing' && user.role === 'supervisor' && employee.Position === 'Machining') {
            return employee.Position === 'Machinist' && employee.Position === 'Cutting';
        }
        if (employee.Department === 'Manufacturing' && user.role === 'supervisor' && employee.Position === 'Planner2') {
            return employee.Position === 'Machinist' && employee.Position === 'Cutting';
        }
        if (employee.Department === 'Manufacturing' && user.role === 'supervisor' && employee.Position === 'Painting') {
            return employee.Position === 'Fabricator/Welder' ;
        }
        if (employee.Department === 'Manufacturing' && user.role === 'supervisor' && employee.Position === 'Supervisor' && employee.Branch === 'Pathum Thani Branch') {
            return employee.Position === 'Machinist Nawanakorn' && employee.Position === 'QC'&& employee.Position === 'Planner';
        }
        if (employee.Department === 'Electrical' && user.role === 'supervisor') {
            return employee.Position === 'Wiring Electrical' ;
        }
        if (employee.Department === 'Mechanical' && user.role === 'supervisor') {
            return employee.Position === 'Assembly' ;
        }
        if (employee.Department === 'Sales' && user.role === 'supervisor') {
            return employee.Position === 'Sales' ;
        }
        if (employee.Department === 'Nawanakorn' && user.role === 'supervisor'&& employee.Position === 'Wiring' && employee.Branch === 'Pathum Thani Branch') {
            return employee.Position === 'Wiring Nawanakorn' ;
        }
        if (employee.Department === 'Nawanakorn' && user.role === 'supervisor'&& employee.Position === 'Assembly' && employee.Branch === 'Pathum Thani Branch') {
            return employee.Position === 'Assembly Nawanakorn' ;
        }
        if (employee.Department === 'HR/GA' && user.role === 'supervisor') {
            return employee.Position === 'Safety Officer' && employee.Position === 'Driver' ;
        }*/
        return false;
    };

    return (
        <div>
            <Navbar />
            <div className={`all-container2 ${user.role === 'human_resource' ? '' : 'disabled'}`}>
                <div className='frame-container2'>
                    <Link className='no-underline' to={user.role === 'human_resource' ? "/add-employee" : "#"}>
                        <img src="/images/people.png" alt="Profile" className="p-image" />
                        <div className="upload-button2">Add Employee</div>
                    </Link>
                </div>
            </div>
            <div className='all-container2'>
                <div>
                    <div>
                        {highPositionEmployees.some(employee => canViewEmployee(employee)) && (
                            <div>
                                <div className='head-mess'>High-Position Employees</div>  
                                <div className="table-container">           
                                    <table className="styled-table">
                                        <thead>
                                            <tr>
                                                <th>EmployeeID</th>
                                                <th>Employee</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {highPositionEmployees.map(employee => (
                                                canViewEmployee(employee) && (
                                                    <tr key={employee.id}>
                                                        <td>{employee.id_employee}</td> 
                                                        <td>
                                                            <Link className='no-underline' to={`/employee/${employee.id}`}> 
                                                                <div className='acc-inputs3'>
                                                                    {employee.image_path && (
                                                                        <img
                                                                            src={`${BASE_URL}/${employee.image_path}`}
                                                                            alt={`${employee.FirstName} ${employee.LastName}`}
                                                                            className="employee-image"
                                                                        />
                                                                    )}
                                                                    <div className='upload-button3'>
                                                                        <div><strong>{employee.FirstName} {employee.LastName}</strong></div>
                                                                        <div>{employee.Position}</div>
                                                                    </div>
                                                                </div>
                                                            </Link>  
                                                        </td>
                                                        
                                                    </tr>
                                                )
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='allem-inputs'>
                    <select
                        id="department-select"
                        value={selectedDepartment}
                        onChange={e => setSelectedDepartment(e.target.value)}
                        className="department-select2"
                    >
                        <option value="All">All Departments</option>
                        {departments.map(department => (
                            <option key={department} value={department}>{department}</option>
                        ))}
                    </select>
                    <select
                        id="branch-select"
                        value={selectedBranch}
                        onChange={e => setSelectedBranch(e.target.value)}
                        className="branch-select"
                    >
                        <option value="All">All Branch</option>
                        {branches.map(branch => (
                            <option key={branch} value={branch}>{branch}</option>
                        ))}
                    </select>
                    
                </div>
                
                    <div className="search-container1">
                        <i className="search-icon1">🔍</i>
                        <input
                            type="text"
                            placeholder="Search Name"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)} 
                            className="input-con"
                        />
                    </div>
                
                {Object.entries(groupedEmployees).map(([department, employees]) => {
                    const viewableEmployees = employees.filter(employee => {
                        const isDepartmentMatch = selectedDepartment === 'All' || selectedDepartment === department;
                        const isBranchMatch = selectedBranch === 'All' || selectedBranch === employee.Branch;
                        return isDepartmentMatch && isBranchMatch && canViewEmployee(employee);
                    });

                    const groupedByPosition = viewableEmployees.reduce((groups, employee) => {
                        const position = employee.Position;
                        if (!groups[position]) {
                            groups[position] = [];
                        }
                        groups[position].push(employee);
                        return groups;
                    }, {});

                    return Object.keys(groupedByPosition).length > 0 && (
                        <div key={department}>
                            <div className='head-mess'>{department} </div>

                            {Object.entries(groupedByPosition).map(([position, employeesInPosition]) => (
                                <div key={position}>
                                    <div className="head-mess2">{position}</div>
                                    <div className="table-container">
                                        <table className="styled-table">
                                            <thead>
                                                <tr>
                                                    <th>EmployeeID</th>
                                                    <th>Employee</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeesInPosition.map((employee) =>  {
                                                     const employeeLeaveRecords = leaveRequests.filter(
                                                        record => record.id_employee === employee.id_employee
                                                    );

                                                    const isInLeaveRange = (dateFrom, dateTo) => {
                                                        const today = new Date();
                                                        const fromDate = new Date(dateFrom);
                                                        const toDate = new Date(dateTo);

                                                        toDate.setDate(toDate.getDate() + 1);
                                                        return today >= fromDate && today < toDate;
                                                    };

                                                    const isManager = ['Department Manager', 'Sec Manager', 'Acting Manager'].includes(employee.Position);

                                                    return (
                                                        <tr key={employee.id}>
                                                            <td>{employee.id_employee}</td>
                                                            <td>
                                                                <Link className='no-underline' to={`/employee/${employee.id}`}>
                                                                    <div className='acc-inputs3'>
                                                                        {employee.image_path && (
                                                                            <img
                                                                                src={`${BASE_URL}/${employee.image_path}`}
                                                                                alt={`${employee.FirstName} ${employee.LastName}`}
                                                                                className="employee-image"
                                                                            />
                                                                        )}
                                                                        <div className='upload-button3'>
                                                                            <div><strong>{employee.FirstName} {employee.LastName}</strong></div>
                                                                            <div>{employee.Branch} </div>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                            
                                                            <td>
                                                                    {isManager ? (
                                                                        <div>{employee.EndDate ? "Resigned" : "Active"}</div>
                                                                    ) : (
                                                                        employeeLeaveRecords.length > 0 ? (
                                                                            <div>
                                                                                {employeeLeaveRecords.map(record => (
                                                                                    isInLeaveRange(record.date_from, record.date_to) ? (
                                                                                        <div key={record.id}>
                                                                                            <span style={{ color: 'red' }}>● </span>{record.leave_type}
                                                                                        </div>
                                                                                    ) : null
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <div>{employee.EndDate ? "Resigned" : "Active"}</div>
                                                                        )
                                                                    )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}

            </div> 
        </div>
    );
};

export default Allem;
