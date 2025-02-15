import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import Navbar from '../Navbar';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from '../config/apiConfig';
import './Leave.css'; 
const Leave = () => {
    const { id_employee } = useParams();  
    const [leaveRecords, setLeaveRecords] = useState([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState('All');
    const [selectedYear, setSelectedYear] = useState('All');
    const [editingRecordId, setEditingRecordId] = useState(null);
    const [editedRemainDay, setEditedRemainDay] = useState('');
    const [editedRemainHour, setEditedRemainHour] = useState('');
    const [allDayLeave, setAllDayLeave] = useState([]);
    
    const handleApproveLeave = async (id) => {
        try {
            await axios.put(`${BASE_URL}/update-leave`, { id, approved: true });
            setLeaveRecords(prevRecords =>
                prevRecords.map(record =>
                    record.id === id ? { ...record, approved: true } : record
                )
            );
            alert('Leave request approved successfully!');
        } catch (error) {
            console.error('Error approving leave request:', error);
            alert('Failed to approve leave request');
        }
    };

    useEffect(() => {
        const fetchLeaveRecords = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/leave-records/${id_employee}`);
                setLeaveRecords(response.data);
            } catch (error) {
                console.error('Error fetching leave records:', error);
            }
        };

        fetchLeaveRecords();
    }, [id_employee]);

    useEffect(() => {
        const fetchAllDayLeave = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-allday-leave/${id_employee}`);
                setAllDayLeave(response.data.data);
            } catch (error) {
                console.error('Error fetching all-day leave data:', error);
            }
        };

        fetchAllDayLeave();
    }, [id_employee]);

    const handleDeleteLeave = async (id) => {
        if (window.confirm('Are you sure you want to delete this leave record?')) {
            try {
                await axios.delete(`${BASE_URL}/delete-leave`, { data: { id } });
                setLeaveRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
                alert('Leave record deleted successfully!');
            } catch (error) {
                console.error('Error deleting leave record:', error);
                alert('Failed to delete leave record');
            }
        }
    };

    const handleEditLeave = (record) => {
        setEditingRecordId(record.id);
        setEditedRemainDay(record.remain_day || '');
        setEditedRemainHour(record.remain_hour || '');
    };

    const handleSaveEdit = async (id) => {
        try {
            const updatedRecord = {
                id,
                remain_day: editedRemainDay,
                remain_hour: editedRemainHour,
            };
            await axios.put(`${BASE_URL}/update-leave`, updatedRecord);

            setLeaveRecords(prevRecords =>
                prevRecords.map(record =>
                    record.id === id
                        ? { ...record, remain_day: editedRemainDay, remain_hour: editedRemainHour }
                        : record
                )
            );

            setEditingRecordId(null);
            alert('Leave record updated successfully!');
        } catch (error) {
            console.error('Error saving leave record:', error);
            alert('Failed to update leave record');
        }
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
        return records.filter(record => record.approved !== 'Non Approved').reduce((totals, record) => {
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

    const leaveTypes = [...new Set(leaveRecords.map(record => record.leave_type))];
    const years = [...new Set(leaveRecords.map(record => new Date(record.date_from).getFullYear()))];

    const filteredLeaveRecords = selectedLeaveType === 'All'
        ? leaveRecords
        : leaveRecords.filter(record => record.leave_type === selectedLeaveType);

    const filteredByYear = selectedYear === 'All'
        ? filteredLeaveRecords
        : filteredLeaveRecords.filter(record => new Date(record.date_from).getFullYear().toString() === selectedYear);

    const filteredAllDayLeave = allDayLeave.filter(leave => {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        return leave.year === currentYear || leave.year === nextYear;
    });
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
    const getStatus = (dateFrom, dateTo) => {
        const currentDate = new Date().toISOString().split('T')[0]; 
        if (currentDate >= dateFrom && currentDate <= dateTo) {
            return 'Current Leave';
        }
        return '';
    };
    const isToday = (date) => {
        const today = new Date();
        const dateToCheck = new Date(date);
        return today.toDateString() === dateToCheck.toDateString();
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
            <Navbar />
            <div className='leave-container'>
                <div className='leave-mes'>Leave Records for Employee {id_employee}</div>
                <div className='leave-inputs'>
                    <label htmlFor="leaveType">Select Leave:</label>
                    <select id="leaveType" onChange={(e) => setSelectedLeaveType(e.target.value)}>
                        <option value="All">All</option>
                        {leaveTypes.map((leaveType) => (
                            <option key={leaveType} value={leaveType}>{leaveType}</option>
                        ))}
                    </select>

                    <label htmlFor="yearSelect">Select Year:</label>
                    <select id="yearSelect" onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="All">All</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className='leave-mes1'>Remaining Leave Days</div>
                
                <div className="blocks-container2">
                    
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
                                                    record.approved === 'Non Approved' &&
                                                    isDateInRange(record.date_from, record.date_to)
                                                ) ? "gray" : leaveRecords.some(record => 
                                                    record.leave_type === 'Sick Leave' && 
                                                    isDateInRange(record.date_from, record.date_to)
                                                ) ? "green" : "gray", 
                                                fontSize: '20px',
                                                marginRight: '5px'
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
                                                    record.approved === 'Non Approved' &&
                                                    isDateInRange(record.date_from, record.date_to)
                                                ) ? "gray" : leaveRecords.some(record => 
                                                    record.leave_type === 'Business Leave (BP)' && 
                                                    isDateInRange(record.date_from, record.date_to)
                                                ) ? "green" : "gray", 
                                                fontSize: '20px',
                                                marginRight: '5px'
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
                                                        record.approved === 'Non Approved' &&
                                                        isDateInRange(record.date_from, record.date_to)
                                                    ) ? "gray" : leaveRecords.some(record => 
                                                        record.leave_type === 'Business Leave (BW)' && 
                                                        isDateInRange(record.date_from, record.date_to)
                                                    ) ? "green" : "gray", 
                                                    fontSize: '20px',
                                                    marginRight: '5px'
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
                                                        record.approved === 'Non Approved' &&
                                                        isDateInRange(record.date_from, record.date_to)
                                                    ) ? "gray" : leaveRecords.some(record => 
                                                        record.leave_type === 'Annual Leave' && 
                                                        isDateInRange(record.date_from, record.date_to)
                                                    ) ? "green" : "gray", 
                                                    fontSize: '20px',
                                                    marginRight: '5px'
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
                                        <div className="block-message1">Other Leave</div>
                                        <div className='con2'></div>
                                        <div className="block-message1">
                                            <img src="/images/contact3.png" alt="contact-hr" className="bimage" />
                                            <strong>Contact HR</strong>
                                        </div>
                                        <div className='con2'></div>
                                        <div className="block-message1">
                                            <span 
                                                style={{
                                                    color: leaveRecords.some(record => 
                                                        record.leave_type === 'Other Leave' && 
                                                        record.approved === 'Non Approved' &&
                                                        isDateInRange(record.date_from, record.date_to)
                                                    ) ? "gray" : leaveRecords.some(record => 
                                                        record.leave_type === 'Other Leave' && 
                                                        isDateInRange(record.date_from, record.date_to)
                                                    ) ? "green" : "gray", 
                                                    fontSize: '20px',
                                                    marginRight: '5px'
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

                        <div className="blocks1">
                            <div className="block-container1">
                                <div className="block-orange">
                                    <Link to="/addleave" className="no-underline">
                                        <div className="block-message1">Absence Work</div>
                                        <div style={{marginTop:'5px'}}></div>
                                        <div className="block-message2">
                                            {leaveRecords.filter(record => record.approved === 'Non Approved').length > 0
                                                ? leaveRecords.filter(record => record.approved === 'Non Approved').length
                                                : '-'}
                                        </div>
                                        <div style={{marginTop:'5px'}}></div>
                                        <div className="block-message1">
                                            <span 
                                                style={{
                                                    color: leaveRecords.some(record => 
                                                        record.approved === 'Non Approved' && 
                                                        isDateInRange(record.date_from, record.date_to)
                                                    ) ? "red" : "gray", 
                                                    fontSize: '20px', 
                                                    marginRight: '5px'
                                                }}
                                            >
                                                ●
                                            </span>
                                            Absence
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                </div>
                <div className='leave-mes1'>{selectedLeaveType} Records {selectedYear !== 'All' && `for ${selectedYear}`}</div>
                <div className="table-leave">
                    <table className="styled-table2">
                        <thead>
                        <tr>
                            <th rowSpan="2" className='table-cell' style={{ width: '7%' }}>
                                Leave Type
                            </th>
                            <th colSpan="2" className='table-cell' style={{ width: '10%' }}>
                                Date
                            </th>
                            <th colSpan="2" className='table-cell' style={{ width: '7%' }}>
                                Time
                            </th>
                            <th rowSpan="2" className='table-cell' style={{ width: '5%' }}>
                                Time Duration
                            </th>
                            <th rowSpan="2" className='table-cell' style={{ width: '2%' }}>
                                Days
                            </th>
                            <th colSpan="2" className='table-cell' style={{  width: '20%' }}>
                                Remaining
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
                            
                            <th style={{ textAlign: 'center', border: '2px solid #010000', width: '2%' }}>
                                Days
                            </th>
                            <th style={{ textAlign: 'center', border: '2px solid #010000', width: '2%' }}>
                                Hours
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            {sortedRecords.length > 0 ? (
                                sortedRecords.map((record) => (
                                <tr key={record.id}>
                                    <td className='table-cell' style={{ width: '7%' }}>{record.leave_type}</td>
                                    <td className='table-cell' style={{ width: '10%' }}>{formatDate(record.date_from)}</td>
                                    <td className='table-cell' style={{ width: '10%' }}>{formatDate(record.date_to)}</td>
                                    <td className='table-cell' style={{ width: '7%' }}>{formatTime(record.time_from)}</td>
                                    <td className='table-cell' style={{ width: '7%' }}>{formatTime(record.time_to)}</td>
                                    <td className='table-cell' style={{ width: '5%' }}>{calculateTime(record.time_from, record.time_to)}</td>
                                    <td className='table-cell' style={{ width: '2%' }}>{calculateDays(record.date_from, record.date_to, record.time_from, record.time_to)}</td>

                                    
                                    <td className='table-cell' style={{ width: '2%' }}>
                                        {editingRecordId === record.id ? (
                                        <span>Wait Approved</span>
                                        ) : (
                                            record.remain_day || '-'
                                        )}
                                    </td>
                                    <td className='table-cell' style={{ width: '2%' }}>
                                        {editingRecordId === record.id ? (
                                            <span>Wait Approved</span>
                                        ) : (
                                            record.remain_hour || '-'
                                        )}
                                    </td>
                                    <td className='table-cell' style={{ width: '10%' }}>{record.reason}</td>
                                    <td className='table-cell' style={{ width: '5%' }}>
                                        {record.evidence_path ? (
                                            <a href={`${BASE_URL}/${record.evidence_path}`} target="_blank" rel="noopener noreferrer">
                                                View Evidence
                                            </a>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>
                                    <td className='table-cell' style={{ width: '5%' }}>
                                    {record.approved ? (
                                       <div
                                            className={`button ${record.approved === 'Approved' ? 'button-approve2' : 'button-reject'}`}
                                        >
                                            {record.approved}
                                        </div>
                                        ) : (
                                        <p className="button2 button-wait">Wait Approve</p>
                                        )}
                                    </td>
                                    
                                    <td className='table-cell' style={{ width: '5%' }}>
                                        {record.approved_by_me ? (
                                            <p className="button2 button-approve2">HR Acknowledged</p>
                                            ) : (
                                            <p className="button2 button-wait">Wait HR Approve</p>
                                        )}
                                    </td>
                                   {/* <td className='table-cell' style={{ width: '5%' }}>
                                        <button className="button button-delete" onClick={() => handleDeleteLeave(record.id)}>
                                            Delete
                                        </button>
                                    </td>*/}
                                   
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12">No leave records</td>
                            </tr>
                        )}

                        </tbody>
                    </table>
                </div>
                
                <div className='leave-mes1'>All-Day Leave</div>
                <div className="table-leave">
                    <table className="styled-table2">
                        <thead>
                            <tr>
                                <th className='table-cell' style={{ width: '30%' }}>Year</th>
                                <th className='table-cell' style={{ width: '40%' }}>Leave Type</th>
                                <th className='table-cell' style={{ width: '30%' }}>All Day Leave</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAllDayLeave.length > 0 ? (
                                filteredAllDayLeave.map((leave) => (
                                    <tr key={leave.id}>
                                        <td className='table-cell'>{leave.year}</td>
                                        <td className='table-cell'>{leave.leave_type}</td>
                                        <td className='table-cell'>{leave.total_days}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">No all-day leave records</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leave;
