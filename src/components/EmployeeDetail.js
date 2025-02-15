import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../EmployeeDetail.css';
import Navbar from '../Navbar';
import { useUser } from '../UserContext'; 
import AddAlldayLeave from './AddAlldayLeave'; 
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
const EmployeeDetail = () => {
    const { id_employee } = useParams(); 
    const [employee, setEmployee] = useState(null);
    const navigate = useNavigate();
    const { user } = useUser();
    const [showDeletePopup, setShowDeletePopup] = useState(false); 
    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            const response = await fetch(`${BASE_URL}/get-employee/${id_employee}`); 
            const data = await response.json();
            setEmployee(data);
        };

        fetchEmployeeDetails();
    }, [id_employee]); 

    if (!employee) {
        return <div>Loading...</div>;
    }

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${BASE_URL}/employee/${id_employee}`, { 
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Employee deleted successfully');
                navigate('/Allem');
            } else {
                alert('Failed to delete employee');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const confirmDelete = () => setShowDeletePopup(true); // Show delete popup
    const cancelDelete = () => setShowDeletePopup(false);

    const handleEdit = () => {
        navigate(`/employee/edit/${id_employee}`); 
    };
    const calculateYears = (startDate) => {
        if (!startDate) return null;
        const start = new Date(startDate);
        const now = new Date();
        const years = now.getFullYear() - start.getFullYear();
        const hasCompletedYear = 
          now.getMonth() > start.getMonth() || 
          (now.getMonth() === start.getMonth() && now.getDate() >= start.getDate());
        return hasCompletedYear ? years : years - 1;
    };
    return (
        <div>
            <Navbar />
            
            <div className="employee-details-container">
                <div className="image-container">
                    <img
                        src={`${BASE_URL}/${employee.image_path}`}
                        alt={`${employee.FirstName} ${employee.LastName}`}
                        className="employee-image-large"
                    />
                </div>
                <div className="employee-info">
                    <div>{employee.id_employee} - {employee.Position}</div>
                    <div>{employee.FirstName} {employee.LastName}</div>
                    <p>{employee.Branch}</p>
                </div>
                <div className={`button-container ${user.role === 'human_resource' ? '' : 'disabled'}`}>
                    <button onClick={confirmDelete} className="delete-button">Delete</button>
                    <button onClick={handleEdit} className="edit-button">Edit</button>
                </div>
                {showDeletePopup && (
                    <>
                        <div className="popup-overlay"></div>
                        <div className="popup-confirmation">
                            <div className="pop-container">
                                <div className='pop-mes2'>Are you sure you want to delete?</div>
                                <div className="popup-buttons">
                                    <button onClick={handleDelete}>Yes</button>
                                    <button onClick={cancelDelete}>No</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="blocks-container1">
                {!(
                    ['chairman', 'manager director', 'director', 'general manager', 'department manager', 'sec manager', 'acting manager', 'asst sec manager']
                        .includes(employee.Position.toLowerCase())
                ) && (
                    <>
                      {( user.role === 'admin') && (
                        <div className="blocks1">
                            <div className="block-container1">  
                                <div className="outer-block">
                                    <div className="inner-block">
                                        <p className="block-message1">1</p>
                                        <div className="divider"></div>
                                        <p className="block-message1">2</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                         )}
                         {( user.role === 'admin') && (
                        <div className="blocks1">
                            <div className="block-container1">  
                                <div className="block-green">
                                    <Link to="/work-day" className="no-underline">
                                        <div className="block-message1">Working Day</div>
                                        <div className='con'></div>
                                        <div className="block-message2">X</div>
                                        <div className='con'></div>
                                        <div className="block-message1">Active</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                         )}
                        <div className="blocks1">
                            <div className="block-container1">  
                                <div className="block-yellow">
                                    <Link to={`/daily/${employee.id_employee}`} className="no-underline">
                                        <div className="block-message1"><strong>Overtime</strong></div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        </>
                )}
                {!(
                    ['chairman', 'manager director', 'director', 'general manager', 'department manager', 'sec manager', 'acting manager']
                        .includes(employee.Position.toLowerCase())
                ) && (
                    <>
                        <div className="blocks1">
                            <div className="block-container1">  
                                <div className="block-yellow">
                                    <Link to={`/leave/${employee.id_employee}`} className="no-underline">
                                        <div className="block-message1"><strong>Leave</strong></div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                      
                        <div className={`${user.role === 'human_resource' ? '' : 'disabled'}`}>
                            <div className="blocks1">
                                <div className="block-container1"> 
                                    <div className="block-yellow">
                                        <Link to={`/add-allday-leave/${employee.id_employee}`} className="no-underline">
                                            <div className="block-message1"><strong>Add Leave Day</strong></div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    )}
            </div>

            
            <div className='section-container'>
                <div className="section">
                    <h2>Personal Information</h2>
                    <p><strong>First Name:</strong> {employee.FirstName}</p>
                    <p><strong>Last Name:</strong> {employee.LastName}</p>
                    <p><strong>Nickname:</strong> {employee.NickName}</p>
                    <p><strong>ID Card Number:</strong> {employee.ID_card}</p>
                    <p><strong>Passport:</strong> {employee.Passport}</p>
                    <p><strong>Email Address:</strong> {employee.Email}</p>
                    <p><strong>Phone:</strong> {employee.Phone}</p>
                    <p><strong>Date of Birth:</strong> {formatDate(employee.Data_Birth)}</p>
                    <p><strong>Age:</strong> {calculateAge(employee.Data_Birth)} </p>
                    <p><strong>Blood Group:</strong> {employee.BloodGroup}</p>
                    <p><strong>Marital Status:</strong> {employee.MaritalStatus}</p>
                    <p><strong>Number of Children:</strong> {employee.Number_children}</p>
                </div>
                <div className="section">
                    <h2>Employment Details</h2>
                    <p><strong>Position:</strong> {employee.Position}</p>
                    <p><strong>Department:</strong> {employee.Department}</p>
                    <p><strong>Start Date:</strong> {formatDate(employee.StartDate)} ({employee.StartDate ? `${calculateYears(employee.StartDate)} year` : 'No Data Available'})</p>
                    <p><strong>Status:</strong> {employee.EndDate ? "Resigned" : "Active"}</p>
                </div>
                <div className="section">
                    <h2>Current Address</h2>
                    <p><strong>Address:</strong> {employee.CAddress}</p>
                    <p><strong>City:</strong> {employee.CCity}</p>
                    <p><strong>Country:</strong> {employee.CCountry}</p>
                    <p><strong>Post:</strong> {employee.CPost}</p>
                </div>
                {user.role === 'human_resource' && (
                    <div className="section">
                        <h2>Registered Address</h2>
                        <p><strong>Address:</strong> {employee.RAddress}</p>
                        <p><strong>City:</strong> {employee.RCity}</p>
                        <p><strong>Country:</strong> {employee.RCountry}</p>
                        <p><strong>Post:</strong> {employee.RPost}</p>
                    </div>
                )}
                <div className="section">
                    <h2>Salary</h2>
                    <p><strong>Start Salary:</strong> {employee.StartSalary}</p>
                    <p><strong>Rate Salary:</strong> {employee.RateSalary}</p>
                    <p><strong>Net Salary:</strong> {employee.NetSalary}</p>
                </div>
                <div className="section">
                    <h2>Social Security Scheme</h2>
                    <p><strong>Hospital Under Entitlement:</strong> {employee.Hospital}</p>
                    <p><strong>Emergency Phone :</strong> {employee.Emergency}</p>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetail;
