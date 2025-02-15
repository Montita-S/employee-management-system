import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VisitorModal_sum from './VisitorModal_sum'; 
import EditVisitorModal from './EditVisitorModal';
import { BASE_URL } from '../config/apiConfig';
import './Visitor.css'; 
import { Link } from 'react-router-dom';

const Visitor_sum = () => {  
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
    const getEmployeeDepartment = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? employee.Department : null;
    };
    const getEmployeeBranch = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.Branch}` : null;
    };
    const filteredVisitors = visitors
        .filter(visitor => {
            const visitDateFrom = new Date(visitor.date).toDateString();
            const todayStr =  new Date().toDateString();

            return visitDateFrom === todayStr ;
        })
        .filter(visitor => {
            return user.department === getEmployeeDepartment(visitor.id_employee) || [ 'chairman', 'manager_director', 'director', 'human_resource'].includes(user.role);
        })
        .sort((a, b) => {
            const timeA = a.time_from ? a.time_from.split(':').map(Number) : [0, 0];
            const timeB = b.time_from ? b.time_from.split(':').map(Number) : [0, 0];
            return timeA[0] - timeB[0] || timeA[1] - timeB[1]; 
        });


   
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
    if (filteredVisitors.length === 0) {
        return (
            null
        );
    }

    const handleRowClick = (visitor) => {
        setSelectedVisitor(visitor);
        setModalType('view'); 
    };

    return (
        <div>
                <div>
                    <div className='head-mess10'>Visitor</div>
                </div>
                <div>
                    {filteredVisitors.map((visitor) => {
                        return (
                            <div key={visitor.id}  onClick={() => handleRowClick(visitor)} className="car-request-frame" style={{ cursor: 'pointer' }}>
                                <div className='sch-inputs' >
                                  
                                <div>
                                    <strong>
                                        <img src="/images/user.png" alt="time" className="pic-from" />
                                        {getEmployeeName(visitor.id_employee) ? (
                                            <>
                                                {getEmployeeName(visitor.id_employee)} 
                                                {getEmployeeBranch(visitor.id_employee) && (
                                                    <> ({getEmployeeBranch(visitor.id_employee)})</>
                                                )}
                                            </>
                                        ) : (
                                            <span style={{ color: 'red' }}>
                                                Not Found Employee Name
                                            </span>
                                        )}
                                        <div>
                                            <img src="/images/from3.png" alt="Visitor Origin" className="pic-from" />
                                            {visitor.origin}
                                        </div>
                                    </strong>
                                </div>

                                            
                                            <div>
                                                
                                                <div>{formatTime(visitor.time_from)} </div>
                                                <div>{formatTime(visitor.time_to)}</div>
                                            </div> 
                                        </div>                  
                                </div>
                                    
                               

                        );
                    })}
                </div>
                {modalType === 'view' && selectedVisitor && (
                    <VisitorModal_sum
                        isOpen={!!selectedVisitor}
                        onRequestClose={() => {
                            setModalType(null);
                            setSelectedVisitor(null);
                        }}
                        visitor={selectedVisitor}
                        employeeName={getEmployeeName(selectedVisitor.id_employee)}
    
                        userRole={user.role}
                    />
                )}
        
        </div>
    );
};

export default Visitor_sum;
