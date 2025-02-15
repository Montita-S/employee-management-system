import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar';
import { Link } from 'react-router-dom'; 
import '../Profile.css'; 
import { BASE_URL } from '../config/apiConfig';
const Profile = () => {
    const { user } = useUser(); 
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    
    const [leaveRecords, setLeaveRecords] = useState([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState('All');
    const [selectedYear, setSelectedYear] = useState('All');
    useEffect(() => {
        const fetchLeaveRecords = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/leave-records/${user.id_employee}`);
                setLeaveRecords(response.data);
            } catch (error) {
                console.error('Error fetching leave records:', error);
            }
        };

        fetchLeaveRecords();
    }, [user.id_employee]);
    
    const formatTime = (time) => {
        if (!time) return '-'; 
        const [hours, minutes] = time.split(':');
        const hours12 = (hours % 12) || 12; 
        const ampm = hours < 12 ? 'AM' : 'PM'; 
        return `${hours12}:${minutes} ${ampm}`; 
    };


     const calculateDays = (dateFrom, dateTo, timeFrom, timeTo) => {
        const from = new Date(dateFrom);
        const to = new Date(dateTo);
    
        
        if (from.toDateString() === to.toDateString() && timeFrom === '08:00:00' && timeTo === '17:00:00') {
            return 1;
        }

        const timeDiff = to - from;

        const dayDiff = timeDiff / (1000 * 60 * 60 * 24);

        return dayDiff === 0 ? 0 : dayDiff + 1;
    };
    
    const sumLeaveDaysByType = (records) => {
        return records.reduce((totals, record) => {
            const days = calculateDays(record.date_from, record.date_to, record.time_from, record.time_to);
            if (!totals[record.leave_type]) {
                totals[record.leave_type] = 0;
            }
            totals[record.leave_type] += days;
            return totals;
        }, {});
    };
    

    const leaveTypeTotals = sumLeaveDaysByType(leaveRecords);

    
    const calculateTime = (timeFrom, timeTo) => {
        const [startHour, startMinute] = timeFrom.split(':');
        const [endHour, endMinute] = timeTo.split(':');

        const start = new Date(0, 0, 0, startHour, startMinute); 
        const end = new Date(0, 0, 0, endHour, endMinute);

        let diff = end - start; 
        if (diff < 0) diff += 24 * 60 * 60 * 1000; 

        const hours = Math.floor(diff / (1000 * 60 * 60)); 
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); 

        return `${hours}h ${minutes}m`;
    };

    const handleLeaveTypeChange = (e) => {
        setSelectedLeaveType(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const filteredLeaveRecords = selectedLeaveType === 'All'
        ? leaveRecords
        : leaveRecords.filter(record => record.leave_type === selectedLeaveType);

    const leaveTypes = [...new Set(leaveRecords.map(record => record.leave_type))];

    const filteredByYear = selectedYear === 'All'
        ? filteredLeaveRecords
        : filteredLeaveRecords.filter(record => new Date(record.date_from).getFullYear().toString() === selectedYear);

    const years = [...new Set(leaveRecords.map(record => new Date(record.date_from).getFullYear()))];

    const [allDayLeave, setAllDayLeave] = useState([]);

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    useEffect(() => {
        const fetchAllDayLeave = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-allday-leave/${user.id_employee}`);
                setAllDayLeave(response.data.data);
            } catch (error) {
                console.error('Error fetching all-day leave data:', error);
                alert('Failed to fetch all-day leave data.');
            }
        };

        fetchAllDayLeave();
    }, [user.id_employee]);

    const filteredAllDayLeave = allDayLeave.filter(leave => {
        return leave.year === currentYear || leave.year === nextYear;
    });
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

        if (user && user.id_employee) {
            fetchEmployeeData();  
        }
    }, [user]);
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
    if (error) return <div>{error}</div>;
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };
    
    const leaveTypeSums = leaveTypes.reduce((sums, leaveType) => {
        const totalDaysForType = filteredByYear
            .filter(record => record.leave_type === leaveType)
            .reduce((sum, record) => sum + calculateDays(record.date_from, record.date_to), 0);
        
        sums[leaveType] = totalDaysForType;
        return sums;
    }, {});
    const getRemainingLeaveDays = (leaveType) => {
        const currentYear = new Date().getFullYear();

        const leaveData = filteredAllDayLeave.find(
            (leave) => leave.leave_type === leaveType && leave.year === currentYear
        );
        const totalLeaveDays = leaveData ? leaveData.total_days : 0;

        const leaveTypeTotals = sumLeaveDaysByType(leaveRecords);
        const usedLeaveDays = leaveTypeTotals[leaveType] || 0;

        const remainingDays = totalLeaveDays - usedLeaveDays;

        return remainingDays;
    };
    const sortedRecords = filteredByYear.sort((a, b) => {
        const dateA = new Date(a.date_from);
        const dateB = new Date(b.date_from);

        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;

        const timeA = a.time_from || '00:00:00'; 
        const timeB = b.time_from || '00:00:00';
        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;
    
        return 0;
    });

    const isToday = (date) => {
        const today = new Date();
        const dateToCheck = new Date(date);
        return today.toDateString() === dateToCheck.toDateString();
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

            {employee ? (
                <div>
                    <div className="employee-details-container2">
                        <div className="image-container">
                            <img
                                src={`${BASE_URL}/${employee.image_path}`}
                                alt={`${employee.FirstName} ${employee.LastName}`}
                                className="employee-image-large"
                            />
                        </div>
                        <div className="employee-info10">
                            <div>{employee.FirstName} {employee.LastName}</div>
                            <div>{employee.id_employee} - {employee.Position}</div>
                            <p>{employee.Branch}</p>
                        </div>
                        
                    </div>
                    {( user.role === 'admin') && (
                        <div>
                        
                        {(user.role === 'asst_manager'|| user.role === 'supervisor'|| user.role === 'employee') && (
                            <div className="blocks-container1">
                                {( user.role === 'supervisor'|| user.role === 'employee') && (
                                    <div className="blocks1">
                                        <div className="block-container1">  
                                            <div className="outer-block">
                                                <div className="inner-block">
                                                    <p className="block-message1">X</p>
                                                    <div className="divider"></div>
                                                    <p className="block-message1">X</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            
                                {( user.role === 'supervisor'|| user.role === 'employee') && (
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
                                            <Link to="/addleave" className="no-underline">
                                                <div className="block-message1">Sick Leave</div>
                                                <div className='con'></div>
                                                <div className="block-message2">
                                                    {getRemainingLeaveDays('Sick Leave')}
                                                </div>
                                                <div className='con'></div>
                                                <div className="block-message1">
                                                    <span 
                                                        style={{
                                                            color: leaveRecords.some(record => 
                                                                record.leave_type === 'Sick Leave' && 
                                                                (isToday(record.date_from) || isToday(record.date_to))
                                                            ) ? "green" : "gray", 
                                                            fontSize: '20px',marginRight:'5px'
                                                        }}
                                                    >
                                                        ●
                                                    </span>
                                                    Sick
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="blocks1">
                                    <div className="block-container1">
                                        <div className="block-yellow">
                                            <Link to="/addleave" className="no-underline">
                                                <div className="block-message1">Business Leave</div>
                                                <div className='con'></div>
                                                <div className="block-message2">
                                                    {getRemainingLeaveDays('Business Leave (BP)')}
                                                </div>
                                                <div className='con'></div>
                                                <div className="block-message1">
                                                    <span 
                                                        style={{
                                                            color: leaveRecords.some(record => 
                                                                record.leave_type === 'Business Leave (BP)' && 
                                                                (isToday(record.date_from) || isToday(record.date_to))
                                                            ) ? "green" : "gray", 
                                                            fontSize: '20px',marginRight:'5px'
                                                        }}
                                                    >
                                                        ●
                                                    </span>
                                                    BP
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <div className="blocks1">
                                    <div className="block-container1">  
                                        <div className="block-yellow">
                                            <Link to="/addleave" className="no-underline">
                                                <div className="block-message1">Business Leave</div>
                                                <div className='con'></div>
                                                <div className="block-message2">
                                                    {getRemainingLeaveDays('Business Leave (BW)')}
                                                </div>
                                                <div className='con'></div>
                                                <div className="block-message1"> 
                                                    <span 
                                                        style={{
                                                            color: leaveRecords.some(record => 
                                                                record.leave_type === 'Business Leave (BW)' && 
                                                                (isToday(record.date_from) || isToday(record.date_to))
                                                            ) ? "green" : "gray", 
                                                            fontSize: '20px',marginRight:'5px'
                                                        }}
                                                    >
                                                        ●
                                                    </span>
                                                    BW
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="blocks1">
                                    <div className="block-container1">  
                                        <div className="block-yellow">
                                            <Link to="/addleave" className="no-underline">
                                                <div className="block-message1">Annual Leave</div>
                                                <div className='con'></div>
                                                <div className="block-message2">
                                                    {getRemainingLeaveDays('Annual Leave')}
                                                </div>
                                                <div className='con'></div>
                                                <div className="block-message1"> 
                                                    <span 
                                                        style={{
                                                            color: leaveRecords.some(record => 
                                                                record.leave_type === 'Annual Leave' && 
                                                                (isToday(record.date_from) || isToday(record.date_to))
                                                            ) ? "green" : "gray", 
                                                            fontSize: '20px',marginRight:'5px'
                                                        }}
                                                    >
                                                        ●
                                                    </span>
                                                    Annual
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="blocks1">
                                    <div className="block-container1">  
                                        <div className="block-yellow">
                                            <Link to="/addleave" className="no-underline">
                                                <div className="block-message1"> Other Leave</div>
                                                <div className='con2'></div>
                                                <div className="block-message1"><img src="/images/contact3.png" alt="contact-hr" className="bimage" /><strong>Contact HR</strong> </div>
                                                <div className='con2'></div>
                                                <div className="block-message1"> 
                                                    <span 
                                                        style={{
                                                            color: leaveRecords.some(record => 
                                                                record.leave_type === 'Other Leave' && 
                                                                (isToday(record.date_from) || isToday(record.date_to))
                                                            ) ? "green" : "gray", 
                                                            fontSize: '20px',marginRight:'5px'
                                                        }}
                                                    >
                                                        ●
                                                    </span>
                                                    Other
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                {( user.role === 'supervisor'|| user.role === 'employee') && (
                                    <div className="blocks1">
                                        <div className="block-container1">  
                                            <div className="block-orange">
                                                <Link to="/add-overtime" className="no-underline">
                                                    <div className="block-message1"><strong>Add Overtime</strong></div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        </div>   
                    )} 
                        <div className='section-container'>
                        <div className="section">
                            <h2>Personal Information</h2>
                            <p><strong>First Name:</strong> {employee.FirstName}</p>
                            <p><b>Last Name:</b> {employee.LastName}</p>
                            <p><strong>Nickname:</strong> {employee.NickName}</p>
                            <p><strong>ID Card Number:</strong> {employee.ID_card}</p>
                            <p><strong>Passport:</strong> {employee.Passport}</p>
                            <p><strong>Email Address:</strong> {employee.Email}</p>
                            <p><strong>Phone:</strong> {employee.Phone}</p>
                            <p><strong>Date of Birth:</strong> {formatDate(employee.Data_Birth)}</p>
                            <p><strong>Age:</strong> {calculateAge(employee.Data_Birth)}</p>
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

                        {user.role === 'admin' && (
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
            ) : (
                <p></p>
            )}
            
        </div>
    );
};

export default Profile;
