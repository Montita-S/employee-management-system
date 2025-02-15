import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '../Navbar';
import { useUser } from '../UserContext'; 
import { Link } from 'react-router-dom'; 
import '../Allem.css'; 
import { BASE_URL } from '../config/apiConfig';

const Awaiting = () => {  
    const { user } = useUser();
    const [employees, setEmployees] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [selectedBranch, setSelectedBranch] = useState('All');
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
    const groupedEmployees = employees.reduce((groups, employee) => {
        if (!highPositionTitles.includes(employee.Position.toLowerCase())) {
            const { Department, Branch } = employee;
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
        
        if (user.role === 'human_resource') { //true
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
                        && (employee.Department === 'Sales')&& employee.Position !== 'Acting Manager'; 
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
            //---------------------------------------------------------------------------------------------------------------------------------
           
            return false;
        }

        return false;
    };

    return (
        <div>
            <Navbar />
            
            <div className='all-container2'>
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
                                                    <th>Employee</th>
                                                  
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeesInPosition.map(employee => (
                                                    <tr key={employee.id}>
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
                                                                        <div>{employee.id_employee}</div>
                                                                        <div>{employee.Branch} </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </td>
                                                        <td>
                                                        
                                                            <Link to={`/leave_copy/${employee.id_employee}`} className="no-underline">
                                                                <div className="block-message1"><strong>Leave</strong></div>
                                                            </Link>
                                                        
                                                        </td>
                                                        {!(
                                                            ['asst sec manager']
                                                                .includes(employee.Position.toLowerCase())
                                                        ) && (
                                                            <>
                                                                <td>
                                                                    <Link to={`/daily_copy/${employee.id_employee}`} className="no-underline">
                                                                        <div className="block-message1"><strong>Overtime</strong></div>
                                                                    </Link>
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
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

export default Awaiting;