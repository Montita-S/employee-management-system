import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { BASE_URL } from './config/apiConfig';
import Navbar from './Navbar'; 
import './Admin.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';

const AdminSettings = () => {
    const [id_employee, setIdEmployee] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');
    const [employees, setEmployees] = useState([]);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({ id_employee: '', password: '', role: '', department: '' });
    const [activeTab, setActiveTab] = useState('settings');
    const [feedbackData, setFeedbackData] = useState([]);
    const [deleteMessage, setDeleteMessage] = useState(null); 
    const [feedbackToDelete, setFeedbackToDelete] = useState(null); 
    
    useEffect(() => {
        const fetchFeedbackData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/feedback`);
                const sortedData = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); 
                setFeedbackData(sortedData);
            } catch (error) {
                console.error('Error fetching feedback data:', error);
            }
        };
    
        if (activeTab === 'reports') {
            fetchFeedbackData();
        }
    }, [activeTab]);
    
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
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 2000);
            return () => clearTimeout(timer); 
        }
    }, [message]);

    const getEmployeeName = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.FirstName} ${employee.LastName}` : null; 
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { id_employee: '', password: '', role: '', department: '' };

        if (!id_employee.trim()) {
            newErrors.id_employee = 'Employee ID is required.';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleEditEmployee = async (e) => {
        e.preventDefault();

        const departmentToSend = department === "" ? null : department;
    
        if (!validateForm()) return;
    
        try {
            const response = await axios.post(`${BASE_URL}/admin-settings`, { 
                id_employee, 
                password: password.trim() !== '' ? password : undefined, 
                role: role.trim() !== '' ? role : undefined, 
                department: departmentToSend
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Update failed. Please try again.');
            console.error(error);
        }
    };
    const handleDelete = (feedbackId, message) => {
        setDeleteMessage({ message: `Are you sure you want to delete this feedback?` });
        setFeedbackToDelete(feedbackId);
    };
    
    const handleDeleteConfirm = async () => {
        if (feedbackToDelete) {
            try {
                await axios.delete(`${BASE_URL}/feedback/${feedbackToDelete}`);
                setFeedbackData(feedbackData.filter(feedback => feedback.id !== feedbackToDelete));
            } catch (error) {
                console.error('Error deleting feedback:', error);
                alert('Failed to delete feedback.');
            }
        }
        setDeleteMessage(null);
        setFeedbackToDelete(null);
    };
    
    const handleCancelDelete = () => {
        setDeleteMessage(null);
        setFeedbackToDelete(null);
    };
    
    const getEmojiForScore = (score) => {
        switch (score) {
            case 0:
                return '-';
            case 1:
                return '😡';
            case 2:
                return '😟'; 
            case 3:
                return '😐'; 
            case 4:
                return '🙂'; 
            case 5:
                return '😊';
            default:
                return ''; 
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0'); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Feedback Report', 10, 15);
        const tableColumn = ['Date', 'Score', 'Comments', 'Follow Up', 'Email'];
        const tableRows = [];

        feedbackData.forEach((feedback) => {
            const feedbackRow = [
                formatDate(feedback.created_at),
                feedback.score,
                feedback.comments || '-',
                feedback.followUp || '-',
                feedback.email || '-',
            ];
            tableRows.push(feedbackRow);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save('Feedback_Report.pdf');
    };
    const csvData = feedbackData.map((feedback) => ({
        Date: formatDate(feedback.created_at),
        Score: feedback.score || '-',
        Comments: feedback.comments || '-',
        Follow_Up: feedback.followUp || '-',
        Email: feedback.email || '-',
    }));

    const headers = [
        { label: 'Date', key: 'Date' },
        { label: 'Score', key: 'Score' },
        { label: 'Comments', key: 'Comments' },
        { label: 'Follow Up', key: 'Follow_Up' },
        { label: 'Email', key: 'Email' },
    ];
    return (
        <div>
            <Navbar />
            <div className='admin-container'>
                <div className="tabs-nav2">
                    <button 
                        className={`tab-button2 ${activeTab === 'settings' ? 'active-tab' : ''}`} 
                        onClick={() => setActiveTab('settings')}
                    >
                       Admin Settings
                    </button>
                    <button 
                        className={`tab-button2 ${activeTab === 'reports' ? 'active-tab' : ''}`} 
                        onClick={() => setActiveTab('reports')}
                    >
                        Feedback Report 
                    </button>
                </div>

                {activeTab === 'settings' && (
                    <div className="add-form-frame">
                        {message && <div className="alert-warning">{message}</div>}
                        <form onSubmit={handleEditEmployee}>
                            <h2>Admin Settings</h2>
                            <div>
                                <select 
                                    value={id_employee} 
                                    onChange={(e) => setIdEmployee(e.target.value)} 
                                    className='admin-select'
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map((employee) => (
                                        <option key={employee.id_employee} value={employee.id_employee}>
                                            {employee.id_employee} - {getEmployeeName(employee.id_employee)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginLeft: '10px' }}>
                                <div>
                                    <img src="/images/remove-pass.png" alt="Logo Home" style={{ width: '35px', height: '35px', marginLeft: '5px' }} />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className='ad-re3'
                                    />
                                </div>
                                <div>
                                    <img src="/images/roles.png" alt="Logo Home" style={{ width: '40px', height: '40px' }} />
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className='ad-re3'
                                    >
                                        <option value="">Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="chairman">Chairman</option>
                                        <option value="manager_director">Manager Director</option>
                                        <option value="director">Director</option>
                                        <option value="general_manager">General Manager</option>
                                        <option value="dept_manager">Dept. Manager</option>
                                        <option value="sec_manager">Sec. Manager</option>
                                        <option value="asst_manager">Asst. Sec Manager</option>
                                        <option value="supervisor">Supervisor</option>
                                        <option value="employee">Employee</option>
                                        <option value="human_resource">Human Resource</option>
                                        <option value="act_manager">Acting Manager</option>
                                    </select>
                                </div>

                                <div>
                                    <img src="/images/dept.png" alt="Logo Home" style={{ width: '40px', height: '40px' }} />
                                    <select
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className='ad-re3'
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Design">Design</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Account">Account</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Nawanakorn">Nawanakorn</option>
                                        <option value="Purchase">Purchase</option>
                                        <option value="HR/GA">HR/GA</option>
                                        <option value="ISO">ISO</option>
                                        <option value="">High Position</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className='ad-button'>Update Employee</button>
                        </form>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="add-form-frame2">
                        <h2>Feedback Report</h2>
                        <div style={{display:'flex', justifyContent: 'flex-end' }}>
                            <img 
                                src="/images/pdf.png" 
                                alt="Export to PDF" 
                                className="export-pdf-img" 
                                onClick={exportToPDF} 
                                style={{ cursor: 'pointer'}}
                            />
                        
                            <CSVLink
                                data={csvData}
                                headers={headers}
                                filename="Feedback_Report.csv"
                                className="export-csv-link"
                            >
                                <img 
                                    src="/images/csv.png" 
                                    alt="Export to CSV" 
                                    className="export-csv-img" 
                                    style={{ cursor: 'pointer', width: '50px', height: '45px' }}
                                />
                            </CSVLink>
                        </div>
                        <div className="table-leave">
                            <table className="reports-table">
                                <thead>
                                    <tr>
                                        <th  style={{ width: '10%' }}>Date</th>
                                        <th  style={{ width: '10%' }}>Score</th>
                                        <th  style={{ width: '45%' }}>Comments</th>
                                        <th style={{ width: '7%' }}>Follow Up</th>
                                        <th  style={{ width: '25%' }}>Email</th>
                                        <th style={{ width: '5%' }}>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbackData.map((feedback, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(feedback.created_at)}</td>
                                            <td>
                                                {getEmojiForScore(feedback.score)|| '-'} 
                                                
                                            </td>

                                            <td>{feedback.comments || '-'}</td>
                                            <td>
                                                {feedback.followUp === 'Yes' ? (
                                                    <img src="/images/co.png" alt="co" className="follow-image" />
                                                ) : feedback.followUp === 'No' ? (
                                                    <img src="/images/inco.png" alt="in" className="follow-image" />
                                                ) : null}
                                            </td>

                                            <td>{feedback.email || '-'}</td>
                                            <td>
                                                <button 
                                                    onClick={() => handleDelete(feedback.id)} 
                                                    className="button button-delete"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {deleteMessage && (
                            <>
                            <div className="popup-overlay" onClick={handleCancelDelete}></div>
                            <div className="popup-confirmation">
                                <div className='pop-container'>
                                    <div className='pop-mes2'>{deleteMessage.message}</div>
                                    <div className="popup-buttons">
                                        <button onClick={handleDeleteConfirm}>Yes</button>
                                        <button onClick={handleCancelDelete}>No</button>
                                    </div>
                                </div>
                            </div>
                            </>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSettings;
