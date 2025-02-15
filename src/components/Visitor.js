import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VisitorModal from './VisitorModal'; 
import EditVisitorModal from './EditVisitorModal';
import { BASE_URL } from '../config/apiConfig';
import './Visitor.css'; 
import { Link } from 'react-router-dom';
const Visitor = () => {  
    const { user } = useUser();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [modalType, setModalType] = useState(null); 
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [selectedDateMessage, setSelectedDateMessage] = useState(''); 
    const [startDate, setStartDate] = useState(''); 
    const [endDate, setEndDate] = useState(''); 

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
        const fetchVisitors = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-visitors`);
                setVisitors(response.data); 
            } catch (error) {
                console.error('Error fetching visitor data:', error);
            }
        };

        fetchVisitors();
    }, []);

    const getEmployeeName = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.FirstName} ${employee.LastName}` : null;
    };

    const handleRowClick = (visitor) => {
        setSelectedVisitor(visitor);
        setModalType('view'); 
    };

    const handleEdit = (visitor) => {
        setSelectedVisitor(visitor);
        setModalType('edit'); 
    };

    const handleDelete = async (id) => {
      
            try {
                await axios.delete(`${BASE_URL}/delete-visitor/${id}`);
                setVisitors(visitors.filter(visitor => visitor.id !== id)); 
                alert('Visitor deleted successfully!');
            } catch (error) {
                console.error('Error deleting visitor:', error);
                alert('Failed to delete visitor');
            }
        
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await axios.put(`${BASE_URL}/update-visitor/${id}`, updatedData);
            setVisitors(visitors.map(visitor => (visitor.id === id ? { ...visitor, ...updatedData } : visitor)));
            alert('Visitor updated successfully!');
            navigate('/visitor'); 
        } catch (error) {
            console.error('Error updating visitor:', error);
            alert('Failed to update visitor');
        }
    };

    const filteredVisitors = visitors
        .filter(visitor => {
            const visitorDate = new Date(visitor.date); 
            if (startDate && endDate) {
                return visitorDate >= new Date(startDate) && visitorDate <= new Date(endDate);
            }
            return selectedDate.toDateString() === visitorDate.toDateString();
        })
        .sort((a, b) => {
            const timeA = a.time_from ? a.time_from.split(':').map(Number) : [0, 0];
            const timeB = b.time_from ? b.time_from.split(':').map(Number) : [0, 0];
            return timeA[0] - timeB[0] || timeA[1] - timeB[1]; 
        });


    const generateDayButtons = () => {
        const buttons = [];
        const currentDate = new Date();
        const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())); 
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(weekStart.getDate() + i);
            buttons.push(
                <button className='weekbutton' key={i} onClick={() => {
                    setSelectedDate(day);
                    setSelectedDateMessage(day.toLocaleDateString('en-US', {
                        weekday: 'long', 
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric' 
                    }));
                }}>
                     <div className="weekday">
                        <span>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span> 
                    </div>
                    <div className="day">
                        <span>{day.toLocaleDateString('en-US', { day: 'numeric' })}</span> 
                    </div>
                </button>
            );
            
        }
        return buttons;
    };
    
    const buttons = generateDayButtons();
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
    const getEmployeeBranch = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.Branch}` : null;
    };
    return (
        <div>
            <Navbar />
            <div className='visitor-container'>
                <div>
                    <div className='day-mes'>{selectedDateMessage || `${selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}</div>
                    <div>
                        {buttons}
                    </div>
                </div>

                <div className="date-inputs">
                    <label htmlFor="startDate">Start Date</label>
                    <input 
                        type="date" 
                        id="startDate" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                    />
                    
                    <label htmlFor="endDate">End Date</label>
                    <input 
                        type="date" 
                        id="endDate" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                    />
                </div>
            </div>
            <div className="visitor-frame">
                <div className="visitor-image-container">
                    <img 
                        src="/images/menu.png" 
                        alt="visitor"
                        className="visitor-image"
                    />
                </div>
                <div className='visit-inputs'>
                    <div className='visit-mes'>Visitor</div>
                    <button className="visit-button" onClick={() => navigate('/add-visitor')}>+</button>
                </div>
                <div className="visitor-list">
                    {filteredVisitors.map((visitor) => (
                            <div key={visitor.id} className="visitor-card" onClick={() => handleRowClick(visitor)} style={{ cursor: 'pointer' }}>
                                <div className="visitor-info" >
                                    <div className="visitor-info-left">
                                        <img 
                                            src="/images/visitor2.png" 
                                            alt="visitor"
                                            className="visitor-icon"
                                            
                                        />
                                        <div className="visitor-info-left2">
                                            <div> 
                                                <img src="/images/bran.png" alt="time" className="pic-from" />
                                                {visitor.branch}
                                            </div>
                                           
                                            <div><img src="/images/from3.png"alt="Visitor Origin" className='pic-from' />{visitor.origin}</div> 
                                            <div><img src="/images/time.png"alt="time" className='pic-from' />{formatDate(visitor.date)} ({formatTime(visitor.time_from)} - {formatTime(visitor.time_to)})</div> 
                                        </div>                  
                                    </div>
                                    
                                </div>
                            </div>

                    ))}
                </div>
            </div>

            {modalType === 'view' && selectedVisitor && (
                <VisitorModal
                    isOpen={!!selectedVisitor}
                    onRequestClose={() => {
                        setModalType(null);
                        setSelectedVisitor(null);
                    }}
                    visitor={selectedVisitor}
                    employeeName={getEmployeeName(selectedVisitor.id_employee)}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    userRole={user.role}
                />
            )}

            {modalType === 'edit' && selectedVisitor && (
                <EditVisitorModal 
                    isOpen={!!selectedVisitor} 
                    onRequestClose={() => {
                        setModalType(null); 
                        setSelectedVisitor(null);
                    }} 
                    visitor={selectedVisitor} 
                    onUpdate={handleUpdate}
                />
            )}
        
        </div>
    );
};

export default Visitor;
