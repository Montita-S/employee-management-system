import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditCarModal from './EditCarModal';
import CarModal from './CarModal'; 

import { BASE_URL } from '../config/apiConfig';
import './Visitor.css';
const Car = () => {  
    const { user } = useUser();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [carData, setCarData] = useState([]);
    const [modalType, setModalType] = useState(null); 
    const [selectedCar, setSelectedCar] = useState(null);
    const [carModalOpen, setCarModalOpen] = useState(false); 
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

    const getEmployeeName = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.FirstName} ${employee.LastName}` : null; 
    };

    const handleDelete = async (id) => {
       
            try {
                await axios.delete(`${BASE_URL}/delete-car/${id}`); 
                setCarData(carData.filter(car => car.id !== id)); 
                alert('Car deleted successfully!');
            } catch (error) {
                console.error('Error deleting car:', error);
                alert('Failed to delete car');
            }
        
    };

    const handleEdit = (car) => {
        setSelectedCar(car);
        setModalType('edit'); 
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await axios.put(`${BASE_URL}/update-car/${id}`, updatedData); 
            setCarData(carData.map(car => (car.id === id ? { ...car, ...updatedData } : car)));
            alert('Car updated successfully!');
            navigate('/car'); 
        } catch (error) {
            console.error('Error updating car:', error);
            alert('Failed to update car');
        }
    };

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
        .sort((a, b) => {
            const timeA = a.time_from ? a.time_from.split(':').map(Number) : [0, 0];
            const timeB = b.time_from ? b.time_from.split(':').map(Number) : [0, 0];
            return timeA[0] - timeB[0] || timeA[1] - timeB[1]; 
        });


    
    const openCarModal = (car) => {
        setSelectedCar(car);
        setCarModalOpen(true);
    };

    return (
        <div>
            <Navbar />
            <div className='visitor-container'>
                <h3 className='day-mes'>{selectedDateMessage || selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                <div>
                    {buttons}
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
                    <div className='visit-mes'>Car Reservation</div>
                    <button className="visit-button" onClick={() => navigate('/add-car')}>+</button>
                </div>
                <div className="visitor-list">
                    {filteredCars.map((car) => (
                            <div className="visitor-card" key={car.id} onClick={() => openCarModal(car)} style={{ cursor: 'pointer' }}>
                                 <div className="visitor-info" >
                                    <div className="visitor-info-left">
                                        <img 
                                            src="/images/car2.jpg" 
                                            alt="visitor"
                                            className="visitor-icon"
                                            
                                        />
                                        <div className="visitor-info-left2">
                                       
                                            <div><img src="/images/bran.png" alt="time" className="pic-from" />{car.branch}</div>
                                            <div><img src="/images/ob.png" alt="time" className="pic-from" />{car.objective}</div> 
                                            <div>
                                                <img src="/images/time.png" alt="time" className="pic-from" />
                                                {new Date(car.date_from).toLocaleDateString('en-GB')}
                                                {car.date_to && new Date(car.date_from).toLocaleDateString('en-GB') 
                                                    !== new Date(car.date_to).toLocaleDateString('en-GB') && (
                                                    <> - {new Date(car.date_to).toLocaleDateString('en-GB')}</>
                                                )}

                                            </div>

                                            <div><img src="/images/location.png"alt="location Origin" className='pic-from' /> {car.location}</div> 
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                    ))}
                </div>

            </div>
            {modalType === 'edit' && selectedCar && (
                <EditCarModal 
                    isOpen={!!selectedCar} 
                    onRequestClose={() => {
                        setModalType(null); 
                        setSelectedCar(null);
                    }} 
                    car={selectedCar} 
                    onUpdate={handleUpdate}
                />
            )}
            {selectedCar && (
                <CarModal 
                    isOpen={!!carModalOpen} 
                    onRequestClose={() => setCarModalOpen(null)} 
                    car={selectedCar} 
                    employeeName={selectedCar ? getEmployeeName(selectedCar.id_employee) : ''} 
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    userRole={user.role} 
                />
            )}
        </div>
    );
};

export default Car;
