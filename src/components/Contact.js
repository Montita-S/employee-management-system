import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { useUser } from '../UserContext'; 
import { Link } from 'react-router-dom'; 
import { BASE_URL } from '../config/apiConfig';
import './contact.css'; 
import { CopyToClipboard } from 'react-copy-to-clipboard'; 

const Contact = () => {
    const { user } = useUser();
    const hasAccess = (requiredRoles) => requiredRoles.includes(user.role);  
    const [employees, setEmployees] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [searchTerm, setSearchTerm] = useState(''); 
    const [showPopup, setShowPopup] = useState(false);
    const departments = Array.from(
        new Set(
            employees
                .map(employee => employee.Department)
                .filter(department => department && department.trim() !== '') 
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
            const { Department } = employee;
            if (!groups[Department]) {
                groups[Department] = [];
            }
            if (employee.FirstName.toLowerCase().includes(searchTerm.toLowerCase())) {
                groups[Department].push(employee);
            }
        }
        return groups;
    }, {});
    const handleCopy = () => {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 1000);
    };

    return (
        <div>
            <Navbar />
            {showPopup && (
                <div className="popup-overlay2">
                    <div className="popup-content2">Email copied!</div>
                </div>
            )}
            <div className='con-container'>
                <div>
                    <div>
                        <div className='con-mes'>Contact List</div>
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
                    </div>
                    
                        <div>
                        <div className='head-mes'>High-Position Employees</div>
                        <div className="table-container">
                            <table className="styled-table">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Email Address</th>
                                        <th>Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {highPositionEmployees.map(employee => (
                                        <tr key={employee.id}> 
                                            <td>
                                                <div className='acc-inputs3'>
                                                    <img
                                                        src={`${BASE_URL}/${employee.image_path}`}
                                                        alt={`${employee.FirstName} ${employee.LastName}`}
                                                        className="employee-image"
                                                    />
                                                    <div>
                                                   
                                                        <div><strong>{employee.FirstName} {employee.LastName}</strong></div>
                                                        <div >{employee.Position} </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <CopyToClipboard text={employee.Email} onCopy={handleCopy}>
                                                    <span>{employee.Email}</span>
                                                </CopyToClipboard>
                                            </td>
                                            <td>{employee.Phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                </div>

                <select
                    id="department-select"
                    value={selectedDepartment}
                    onChange={e => setSelectedDepartment(e.target.value)}
                    className="department-select2"
                >
                    <option value="All">All Departments</option>
                    {departments.map(department => (
                        <option key={department} value={department}>{department}</option>
                    ))}department
                </select>

                {Object.entries(groupedEmployees).map(([department, employees]) => (
                        (selectedDepartment === 'All' || selectedDepartment === department) && (
                            <div key={department}>
                                {searchTerm === '' && <div className='head-mes'>{department}</div>}
                                {Object.entries(
                                    employees.reduce((positions, employee) => {
                                        const { Position } = employee;
                                        if (!positions[Position]) {
                                            positions[Position] = [];
                                        }
                                        positions[Position].push(employee);
                                        return positions;
                                    }, {})
                                ).map(([position, positionEmployees]) => (
                                    <div key={position}>
                                        <div className='head-mess3'>{position}</div>
                                        <div className="table-container">
                                            <table className="styled-table">
                                                <thead>
                                                    <tr>
                                                        <th>Employee</th>
                                                        <th>Email Address</th>
                                                        <th>Phone</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {positionEmployees.map(employee => (
                                                        <tr key={employee.id}>
                                                            <td>
                                                                <div className='acc-inputs3'>
                                                                    {employee.image_path && (
                                                                        <img
                                                                            src={`${BASE_URL}/${employee.image_path}`}
                                                                            alt={`${employee.FirstName} ${employee.LastName}`}
                                                                            className="employee-image"
                                                                        />
                                                                    )}
                                                                    <div>
                                                                        <div><strong>{employee.FirstName} {employee.LastName}</strong></div>
                                                                        <div>{employee.Branch}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <CopyToClipboard text={employee.Email} onCopy={handleCopy}>
                                                                    <span>{employee.Email}</span>
                                                                </CopyToClipboard>
                                                            </td>
                                                            <td>{employee.Phone}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ))}

            </div>
        </div>
    );
};

export default Contact;
