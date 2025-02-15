import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar';
import { Link } from 'react-router-dom'; 
import { BASE_URL } from '../config/apiConfig';
import './Dairy.css'; 

const Daily = () => {
    const { user } = useUser(); 
    const { id_employee } = useParams();
    const [overtimeEntries, setOvertimeEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [deleteMessage, setDeleteMessage] = useState({ id: null, message: '' });
    const [employees, setEmployees] = useState([]);
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
    const getEmployeeName = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.FirstName} ${employee.LastName}` : null; 
    };

    useEffect(() => {
        const fetchOvertimeEntries = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/overtime/${id_employee}`);
                const sortedEntries = response.data.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);

                    if (dateA.getTime() === dateB.getTime()) {
                        const timeA = new Date(`1970-01-01T${a.time_from}`);
                        const timeB = new Date(`1970-01-01T${b.time_from}`);
                        return timeA - timeB;
                    }
                    return dateA - dateB;
                });
                setOvertimeEntries(sortedEntries);
                setFilteredEntries(sortedEntries); 
            } catch (error) {
                console.error('Error fetching overtime entries:', error);
            }
        };

        fetchOvertimeEntries();
    }, [id_employee]);

    const formatTime = (time) => {
        if (!time) return ''; 
        const [hours, minutes] = time.split(':');
        const formattedHours = hours.padStart(2, '0');
        return `${formattedHours}:${minutes}`;
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    const handleApprovalToggle = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;

            await axios.put(`${BASE_URL}/api/overtime/approve/${id}`, { approved: newStatus });

            setOvertimeEntries((prevEntries) =>
                prevEntries.map((entry) =>
                    entry.id === id ? { ...entry, approved: newStatus } : entry
                )
            );
        } catch (error) {
            console.error('Error updating approval status:', error);
        }
    };

   
    const handleDeleteConfirmation = (id) => {
        setDeleteMessage({
            id,
            message: 'Are you sure you want to delete?',
        });
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${BASE_URL}/api/overtime/delete/${deleteMessage.id}`);
            setOvertimeEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== deleteMessage.id));
            setFilteredEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== deleteMessage.id));
            setDeleteMessage({ id: null, message: '' });
        } catch (error) {
            console.error('Error deleting overtime entry:', error);
        }
    };

    const handleCancelDelete = () => {
        setDeleteMessage({ id: null, message: '' });
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    useEffect(() => {
        const filtered = overtimeEntries.filter((entry) => {
            const entryDate = new Date(entry.date);
            const matchesMonth = selectedMonth ? entryDate.getMonth() + 1 === parseInt(selectedMonth) : true;
            const matchesYear = selectedYear ? entryDate.getFullYear() === parseInt(selectedYear) : true;
            return matchesMonth && matchesYear;
        });
        setFilteredEntries(filtered);
    }, [selectedMonth, selectedYear, overtimeEntries]);
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
            <Navbar />
            <div className='dairy-container'>
                <div className='dairy-mes'>Daily Work and Overtime Records for Employee {id_employee}</div>
                <div className='dairy-inputs'>
                    {( user.role === 'supervisor'|| user.role === 'employee') && (
                        <Link to="/add-overtime" className="button-link">
                            <div><strong>Add Overtime</strong></div>
                        </Link>
                    
                    )}
                    <label>Select Month:</label>
                    <select value={selectedMonth} onChange={handleMonthChange}>
                        <option value="">All</option>
                        {[...Array(12).keys()].map((month) => (
                            <option key={month + 1} value={month + 1}>
                                {new Date(0, month).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <label>Select Year:</label>
                    <select value={selectedYear} onChange={handleYearChange}>
                        <option value="">All</option>
                        {Array.from(new Set(overtimeEntries.map((entry) => new Date(entry.date).getFullYear()))).map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select> 
                    
                </div>
                <div className='dairy-mes1'>
                    {selectedMonth && new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })} 
                    {selectedYear !== '' && `  ${selectedYear}`}
                    
                </div>
                
                <div className='table-dairy'>
                    <table className="styled-table2">
                        <thead>
                            <tr>
                                <th className='table-cell2'>ID Employee</th>
                                <th className='table-cell'>Employee Name</th>
                                <th className='table-cell2'>Date</th>
                                <th className='table-cell2'>Time From</th>
                                <th className='table-cell2'>Time To</th>
                                <th className='table-cell2'>Overtime Hour</th>
                                
                                <th className='table-cell2'>Job No.</th>
                                <th className='table-cell2'>Allowance</th>
                                <th className='table-cell2'>Driver</th>
                                
                                <th className='table-cell2'>Manager Approval</th>
                                {/*<th className='table-cell2'>Actions</th>*/}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEntries.map((entry) => (
                                <tr key={entry.id}>
                                    <td className='table-cell2'>{entry.id_employee}</td>
                                    <td className='table-cell' style={{ width: '15%' }}>{getEmployeeName(entry.id_employee)}</td>
                                    <td className='table-cell2'>{formatDate(entry.date)}</td>
                                    <td className='table-cell2'>{formatTime(entry.time_from)}</td>
                                    <td className='table-cell2'>{formatTime(entry.time_to)}</td>
                                    <td className='table-cell2'>
                                        {(() => {
                                            const { hours, minutes } = calculateOvertime(entry.time_from, entry.time_to);
                                            const hoursDisplay = hours > 0 ? `${hours} h` : '';
                                            const minutesDisplay = minutes > 0 ? `${minutes} m` : '';
                                            const timeDisplay = `${hoursDisplay} ${minutesDisplay}`.trim();
                                            return timeDisplay ? timeDisplay : '-';
                                        })()}
                                    </td>
                                    
                                    <td className='table-cell2'>{entry.job_no}</td>
                                    <td className='table-cell2'>{entry.allowance || '-'}</td>
                                    <td className='table-cell2'>{entry.driver || '-'}</td>
                                    
                                    <td className='table-cell2'>
                                        <span
                                            className={`status-message ${
                                                entry.approved ? "approved" : "wait-approved"
                                            }`}
                                        >
                                            {entry.approved ? "Approved" : "Wait Approve"}
                                        </span>
                                    </td>

                                    {/*<td className='table-cell2'>
                                        <button className='button button-delete' onClick={() => handleDeleteConfirmation(entry.id)}>Delete</button>
                                    </td>*/}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {deleteMessage.id && (
                    <>
                    <div className="popup-overlay"></div>
                    <div className="popup-confirmation">
                        <div className="pop-container">
                            <div className='pop-mes2'>{deleteMessage.message}</div>
                            <div className="popup-buttons">
                                <button onClick={handleDelete}>Yes</button>
                                <button onClick={handleCancelDelete}>No</button>
                            </div>
                        </div>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Daily;
