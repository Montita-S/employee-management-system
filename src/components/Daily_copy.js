import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import { BASE_URL } from '../config/apiConfig';
import './Dairy.css'; 
import 'jspdf-autotable'; 
import { jsPDF } from "jspdf";
import { CSVLink } from 'react-csv'; 
import { useUser } from '../UserContext';
const Daily_copy = () => {
    const { user } = useUser();
    const { id_employee } = useParams();
    const [overtimeEntries, setOvertimeEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [deleteMessage, setDeleteMessage] = useState({ id: null, message: '' });
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [file, setFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
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
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/overtime-entries/${id_employee}`);
                setFiles(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching uploaded files:', error);
                setLoading(false);
            }
        };

        fetchFiles();
    }, [id_employee]);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    
    const handleFileUpload = async () => {
        if (!file) {
            setUploadMessage('Please select a file before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('evidence', file);
        formData.append('id_employee', id_employee);

        try {
            const response = await axios.post(`${BASE_URL}/add-overtime-entry`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadMessage(response.data.message);
            setFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadMessage('Failed to upload file. Please try again.');
        }
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
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
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

    const handleDateFromChange = (e) => {
        setDateFrom(e.target.value);
    };

    const handleDateToChange = (e) => {
        setDateTo(e.target.value);
    };
    useEffect(() => {
        const filtered = overtimeEntries.filter((entry) => {
            const entryDate = new Date(entry.date);
            const matchesMonth = selectedMonth ? entryDate.getMonth() + 1 === parseInt(selectedMonth) : true;
            const matchesYear = selectedYear ? entryDate.getFullYear() === parseInt(selectedYear) : true;
            const matchesDateRange =
                (!dateFrom || new Date(entry.date) >= new Date(dateFrom)) &&
                (!dateTo || new Date(entry.date) <= new Date(dateTo));
            return matchesMonth && matchesYear && matchesDateRange;
        });
        setFilteredEntries(filtered);
    }, [selectedMonth, selectedYear, dateFrom, dateTo, overtimeEntries]);

    const exportToPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text(`Overtime Records for Employee ${id_employee}`, 14, 20);
 
        const columns = [
            'ID Employee', 'Time From', 'Time To', 'Date', 'Job No', 'Allowance', 'Driver', 'Approval Status'
        ];

        const data = filteredEntries.map(entry => [
            entry.id_employee,
            formatTime(entry.time_from),
            formatTime(entry.time_to),
            formatDate(entry.date),
            entry.job_no,
            entry.allowance || '-',
            entry.driver || '-',
            entry.approved ? 'Approved' : 'Wait Approve'
        ]);

        doc.autoTable({
            head: [columns],
            body: data,
            startY: 30,
            theme: 'striped',
        });

        doc.save(`${id_employee}_overtime_records.pdf`);
    };
    const csvHeaders = [
        { label: 'ID Employee', key: 'id_employee' },
        { label: 'Employee Name', key: 'employee_name' },
        { label: 'Date', key: 'date' },
        { label: 'Time From', key: 'time_from' },
        { label: 'Time To', key: 'time_to' },
        { label: 'Overtime Hour', key: 'overtime_hour' },
        { label: 'Job No.', key: 'job_no' },
        { label: 'Allowance', key: 'allowance' },
        { label: 'Driver', key: 'driver' },
        { label: 'Approval Status', key: 'approved' }
    ];
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

    const csvData = filteredEntries.map(entry => {
        const { hours, minutes } = calculateOvertime(entry.time_from, entry.time_to);
        const hoursDisplay = hours > 0 ? `${hours}h` : '';
        const minutesDisplay = minutes > 0 ? `${minutes}m` : '';
        const overtimeHour = `${hoursDisplay} ${minutesDisplay}`.trim() || '-';

        return {
            id_employee: entry.id_employee,
            employee_name: getEmployeeName(entry.id_employee) || 'Unknown',
            date: entry.date,
            time_from: entry.time_from,
            time_to: entry.time_to,
            overtime_hour: overtimeHour,
            job_no: entry.job_no || '-',
            allowance: entry.allowance || '-',
            driver: entry.driver || '-',
            approved: entry.approved ? 'Approved' : 'Wait Approve'
        };
    });

    const headers = [
        { label: 'ID Employee', key: 'id_employee' },
        { label: 'Time From', key: 'time_from' },
        { label: 'Time To', key: 'time_to' },
        { label: 'Date', key: 'date' },
        { label: 'Job No', key: 'job_no' },
        { label: 'Allowance', key: 'allowance' },
        { label: 'Driver', key: 'driver' },
        { label: 'Approval Status', key: 'approved' },
    ];
    
    
    return (
        <div>
            <Navbar />
            <div className='dairy-container'>
                <div className='dairy-mes'>Daily Work and Overtime Records for Employee {id_employee}</div>
                <div className='dairy-inputs'>
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
                <div className='dairy-inputs'>
                    <div className='date-inputs2'>
                        <img 
                            src="/images/pdf.png" 
                            alt="Export to PDF" 
                            className="export-pdf-img" 
                            onClick={exportToPDF} 
                            style={{ cursor: 'pointer' }}
                        />
                        {/*<CSVLink 
                            data={filteredEntries} 
                            headers={headers} 
                            filename={`${id_employee}_overtime_records.csv`} 
                            className="export-csv-link"
                        >
                            <img 
                                src="/images/csv.png" 
                                alt="Export to CSV" 
                                className="export-csv-img" 
                                style={{ cursor: 'pointer', width: '50px', height: '50px' }}
                            />
                        </CSVLink>*/}
                        
                        <CSVLink
                            headers={csvHeaders}
                            data={csvData}
                            filename={`${id_employee}_overtime_records.csv`}
                            className="button-export"
                        >
                            <img 
                                    src="/images/csv.png" 
                                    alt="Export to CSV" 
                                    className="export-csv-img" 
                                    style={{ cursor: 'pointer', width: '50px', height: '50px' }}
                            />
                        </CSVLink>
                
                        <label>Date From:</label>
                        <input type="date" value={dateFrom} onChange={handleDateFromChange} />
                        <label>Date To:</label>
                        <input type="date" value={dateTo} onChange={handleDateToChange} />
                    </div>
                    
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
                                <th className='table-cell2'> Manager Approved</th>
                                <th className='table-cell2'>Action</th>
                                
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
                                   {/* <td className='table-cell2'>
                                        {entry.approved ? (
                                            <span className="status-message approved">Approved</span>
                                        ) : (
                                            <label className="checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    checked={entry.approved === 1}
                                                    onChange={() => handleApprovalToggle(entry.id, entry.approved)}
                                                    className="status wait-approved"
                                                />
                                            </label>
                                        )}
                                    </td>*/}
                                    {user.role === 'human_resource' && (
                                    <td className='table-cell2'>
                                        <span
                                            className={`status-message ${
                                                entry.approved ? 'approved' : 'wait-approved'
                                            }`}
                                        >
                                            {entry.approved ? 'Approved' : 'Wait Approve'}
                                        </span>
                                    </td>
                                )}
                                {!(['human_resource'].includes(user.role.toLowerCase())) && (
                                    <td className='table-cell2'>
                                        {entry.approved ? (
                                            <span className="status-message approved">Approved</span>
                                        ) : (
                                            <label className="checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    checked={entry.approved === 1}
                                                    onChange={() => handleApprovalToggle(entry.id, entry.approved)}
                                                    className="status wait-approved"
                                                />
                                            </label>
                                        )}
                                    </td>
                                )}
                                    <td className='table-cell2' >
                                        <div className={` ${user.role === 'human_resource' ? '' : 'disabled'}`}>
                                            <button className='button button-delete' onClick={() => handleDeleteConfirmation(entry.id)}>Delete</button>
                                        </div>
                                    </td>
                                    

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              {/*  <h2>Uploaded Files</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : files.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Evidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((file) => (
                                <tr key={file.id}>
                                    <td>{file.id}</td>
                                    <td>{file.date}</td>
                                    <td>
                                        {file.evidence_path ? (
                                            <a href={`${BASE_URL}/${file.evidence_path}`} target="_blank" rel="noopener noreferrer">
                                                View File
                                            </a>
                                        ) : (
                                            'No File'
                                        )}
                                    </td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No files uploaded.</p>
                )}

            <div>
                <label>Upload Evidence:</label>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleFileUpload}>Upload</button>
                {uploadMessage && <p>{uploadMessage}</p>}
            </div>*/}
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

export default Daily_copy;
