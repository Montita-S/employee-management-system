import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext'; 

import axios from 'axios';

import CarModal_sum from './CarModal _sum';
import { BASE_URL } from '../config/apiConfig';
import './Visitor.css';
const Car_sum = () => {  
    const { user } = useUser();

    const [employees, setEmployees] = useState([]);
    const [carData, setCarData] = useState([]);

    const [selectedCar, setSelectedCar] = useState(null);
    const [carModalOpen, setCarModalOpen] = useState(false); 

    const today = new Date();

    const [modalType, setModalType] = useState(null); 

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [selectedDateMessage, setSelectedDateMessage] = useState('');

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
        const fetchCarData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-car`);
                setCarData(response.data); 
            } catch (error) {
                console.error('Error fetching car data:', error);
            }
        };

        fetchCarData();
    }, []); 

    const getEmployeeDepartment = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? employee.Department : null;
    };

    const filteredCars = carData
        .filter(car => {
            const carDateFrom = new Date(car.date_from);
            
            const carDateTo = car.date_to ? new Date(car.date_to) : carDateFrom;
            carDateTo.setDate(carDateTo.getDate() + 1);

            if (startDate && endDate) {
                return carDateFrom >= new Date(startDate) && (carDateTo ? carDateTo <= new Date(endDate) : true);
            }
            if (carDateFrom.toDateString() === carDateTo.toDateString()) {
                return selectedDate.toDateString() === carDateFrom.toDateString();
            }
            return selectedDate >= carDateFrom && (carDateTo ? selectedDate <= carDateTo : true);
        })
        .filter(car => {
            return user.department === getEmployeeDepartment(car.id_employee) || ['admin', 'chairman', 'manager_director', 'director', 'human_resource'].includes(user.role);
        })
        .sort((a, b) => {
            const timeA = a.time_from ? a.time_from.split(':').map(Number) : [0, 0];
            const timeB = b.time_from ? b.time_from.split(':').map(Number) : [0, 0];
            return timeA[0] - timeB[0] || timeA[1] - timeB[1]; 
        });

    const hasRole = ['admin', 'chairman', 'manager_director', 'director', 'human_resource'].includes(user.role);

    const getEmployeeName = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.FirstName} ${employee.LastName}` : null; 
    };

    if (filteredCars.length === 0) {
        return (
            null
        );
    }
    const openCarModal = (car) => {
        setSelectedCar(car);
        setCarModalOpen(true);
    };


    return (
        <div>
            <div>
                <div className='head-mess10'>Car Reservation</div>
            </div>

            <div>
                {filteredCars.map((car) => {
                    return (
                        <div className="car-request-frame"  key={car.id} onClick={() => openCarModal(car)} style={{ cursor: 'pointer' }}>
                            <div className='sch-inputs'>
                                
                                        <div>
                                            <strong>
                                                <img src="/images/user.png" alt="time" className="pic-from" />
                                                {getEmployeeName(car.id_employee) ? (
                                                    <>
                                                        {getEmployeeName(car.id_employee)} ({car.branch})
                                                    </>
                                                ) : (
                                                    <span style={{ color: 'red' }}>
                                                        Not Found Employee Name
                                                    </span>
                                                )}
                                                <div><img src="/images/ob.png" alt="time" className="pic-from" />{car.objective}</div> 
                                                <div><img src="/images/location.png" alt="location Origin" className="pic-from" /> {car.location}</div> 
                                            </strong>
                                        </div>
                                        
                                        <div>
                                            
                                            <div>{new Date(car.date_from).toLocaleDateString('en-GB')}</div>
                                            <div>
                                                    {car.date_to && new Date(car.date_from).toLocaleDateString('en-GB') !== new Date(car.date_to).toLocaleDateString('en-GB') && (
                                                        <>  {new Date(car.date_to).toLocaleDateString('en-GB')}</>
                                                    )}
                                            </div>
                                           
                                        </div>
                                      
                                    </div>
                                </div>
                           
                    );
                })}
            </div>
            <CarModal_sum 
                isOpen={carModalOpen} 
                onRequestClose={() => setCarModalOpen(false)} 
                car={selectedCar} 
                employeeName={selectedCar ? getEmployeeName(selectedCar.id_employee) : ''} 
                userRole={user.role} 
            />
        </div>
    );
};

export default Car_sum;
