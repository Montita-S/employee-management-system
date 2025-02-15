import React, { useState } from 'react';
import Modal from 'react-modal';
import './Visitor.css'; 
import { useUser } from '../UserContext'; 
const CarModal_sum = ({ isOpen, onRequestClose, car, employeeName }) => {

    const { user } = useUser(); 
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


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
                content: {
                    backgroundColor: '#f0f0f0',
                    color: '#000',
                    borderRadius: '10px',
                    padding: '20px',
                    maxWidth: '600px',
                    margin: 'auto',
                    height:'500px'
                },
            }}
        >
            <h2>Car Reservation</h2>
            <div>
                {car && (
                    <div>
                       <p>
                            <strong>Reservations Name: </strong> 
                            {employeeName ? employeeName : <span style={{ color: 'red' }}>Not Found Employee Name</span>}
                        </p>

                        <p><strong>Employee ID:</strong> {car.id_employee}</p>
                        <p><strong>Date:</strong> {formatDate(car.date_from)}- {car.date_to ? formatDate(car.date_to) : formatDate(car.date_from)}</p>
                       
                        <p><strong>Time:</strong> {formatTime(car.time_from)} - {formatTime(car.time_to)}</p>
                        
                        <p><strong>Location:</strong> {car.location}</p>
                        <p><strong>Job No:</strong> {car.job_no}</p>
                        <p><strong>Number of Persons:</strong> {car.number_of_person}</p>
                        {car.attendees && (
                            <p><strong>Employee ID for Passenger:</strong> {car.attendees}</p>
                        )}

                        
                        <p><strong>Objective:</strong> {car.objective}</p>
                        <p><strong>Driver:</strong> {car.driver} {car.select_car && `(${car.select_car})`}</p>

                       
                        <p>
                            <strong>Driver Name: </strong> 
                            {car.driver_name ? car.driver_name : <span style={{ color: 'red' }}>Wait for HR to fill in data.</span>}
                        </p>

                        <p><strong>Branch:</strong> {car.branch}</p>
                        <p><strong>Type of Car:</strong> {car.type_car}</p>
                        <p><strong>Registration:</strong> {car.registration ? car.registration :<span style={{ color: 'red' }}> Wait for HR to fill in data. </span>}</p>
                        
                       
                    </div>
                )}

            </div>
        </Modal>
    );
};

export default CarModal_sum;
