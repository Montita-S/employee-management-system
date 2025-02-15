import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
import './Leave.css';
import { CSVLink } from 'react-csv'; 

const CarTable = () => {
    const [carData, setCarData] = useState([]);
    const [activeBranch, setActiveBranch] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(''); 
    const [selectedYear, setSelectedYear] = useState(''); 
    const [selectedDateFrom, setSelectedDateFrom] = useState(''); 
    const [selectedDateTo, setSelectedDateTo] = useState('');
    useEffect(() => {
        const fetchCarData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-car`);
                setCarData(response.data);

                if (response.data.length > 0) {
                    setActiveBranch(response.data[0].branch);
                }
            } catch (error) {
                console.error('Error fetching car data:', error);
            }
        };

        fetchCarData();
    }, []);

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

    const branches = [...new Set(carData.map((car) => car.branch))];

    const filteredData = carData.filter((car) => {
        const carDate = new Date(car.date_from);
        const carMonth = carDate.getMonth() + 1; 
        const carYear = carDate.getFullYear();
        
        const dateFrom = selectedDateFrom ? new Date(selectedDateFrom) : null;
        const dateTo = selectedDateTo ? new Date(selectedDateTo) : null;

        const isDateInRange =
            (!selectedDateFrom || carDate >= dateFrom) &&
            (!selectedDateTo || carDate <= dateTo);

        return (
            car.branch === activeBranch &&
            (!selectedMonth || carMonth === parseInt(selectedMonth)) &&
            (!selectedYear || carYear === parseInt(selectedYear)) &&
            isDateInRange
        );
    });

    const getEmployeeName = (id_employee) => {
        const employee = employees.find(emp => emp.id_employee === id_employee);
        return employee ? `${employee.FirstName} ${employee.LastName}` : null;
    };

    const csvData = filteredData.map((car) => ({
        'Name': getEmployeeName(car.id_employee) || "Not Found",
        'Date': `${formatDate(car.date_from)} ${car.date_to && formatDate(car.date_from) !== formatDate(car.date_to) ? `- ${formatDate(car.date_to)}` : ''}`,
        'Time From': formatTime(car.time_from),
        'Time To': formatTime(car.time_to),
        'Location': car.location,
        'Job No.': car.job_no,
        'Number Of Persons': car.number_of_person,
        'Passenger': car.attendees || '-',
        'Driver': car.driver,
        'Driver Name': car.driver_name || "Wait for HR",
        'Type Car': car.type_car,
        'Registration': car.registration || "Wait for HR",
        'Branch': car.branch,
        'Objective': car.objective
    }));
    return (
        <div>
            <h1>Car Reservation</h1>
            <div className="branch-tabs">
                {branches.map((branch) => (
                    <button
                        key={branch}
                        className={`branch-tab ${branch === activeBranch ? 'active' : ''}`}
                        onClick={() => setActiveBranch(branch)}
                    >
                        {branch}
                    </button>
                ))}
            </div>
            <div className='dairy-inputs'>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    <option value="">Select Month</option>
                    {[...Array(12).keys()].map((month) => (
                        <option key={month + 1} value={month + 1}>
                            {new Date(0, month).toLocaleString('default', { month: 'long' })}
                        </option>
                    ))}
                </select>

                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} >
                    <option value="">Select Year</option>
                    {Array.from(
                        new Set(carData.map((car) => new Date(car.date_from).getFullYear()))
                    ).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div className='dairy-inputs'>
                <div className='date-inputs2'>
                    <CSVLink
                        data={csvData}
                        filename={`${activeBranch}-car-data.csv`}
                        className="export-button"
                        style={{ marginBottom: '10px', display: 'inline-block' }}
                    >
                        <img 
                            src="/images/csv.png" 
                            alt="Export to CSV" 
                            className="export-csv-img" 
                            style={{ cursor: 'pointer', width: '50px', height: '45px' }}
                        />
                    </CSVLink>
                    <label>Date From:</label>
                    <input 
                        type="date"
                        value={selectedDateFrom}
                        onChange={(e) => setSelectedDateFrom(e.target.value)}
                        style={{ padding: '5px', marginRight: '10px' }}
                    />
                    <label>Date To:</label>
                    <input 
                        type="date"
                        value={selectedDateTo}
                        onChange={(e) => setSelectedDateTo(e.target.value)}
                        style={{ padding: '5px' }}
                    />
                
                    
                
                </div>     
            </div>
            <div className="table-leave">
                <table>
                    <thead>
                        <tr>
                            <th className='table-cell' style={{ width: '7%' }}>Name</th>
                            <th className='table-cell' style={{ width: '5%' }}>Date</th>
                            <th className='table-cell' style={{ width: '6%' }}>Time From</th>
                            <th className='table-cell' style={{ width: '6%' }}>Time To</th>
                            <th className='table-cell' style={{ width: '10%' }}>Location</th>
                            <th className='table-cell' style={{ width: '5%' }}>Job No</th>
                            <th className='table-cell' style={{ width: '2%' }}>Number of Passenger</th>
                            <th className='table-cell' style={{ width: '5%' }}>Passenger</th>
                            <th className='table-cell' style={{ width: '10%' }}>Driver</th>
                            <th className='table-cell' style={{ width: '10%' }}>Driver Name</th>
                            
                            <th className='table-cell' style={{ width: '7%' }}>Type Car</th>
                            <th className='table-cell' style={{ width: '7%' }}>Registration</th>
                            
                            <th className='table-cell' style={{ width: '10%' }}>Branch</th>
                            <th className='table-cell' style={{ width: '11%' }}>Objective</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                    {filteredData.length > 0 && (
                            filteredData.map((car) => (
                                <tr key={car.id}>
                                    <td className='table-cell' style={{ width: '14%' }}>
                                        {getEmployeeName(car.id_employee) ? (
                                            <>
                                                {getEmployeeName(car.id_employee)} ({car.id_employee})
                                            </>
                                            ) : (
                                                <span style={{ color: 'red' }}>
                                                    Not Found Employee
                                                </span>
                                        )} 
                                    </td>
                                    <td className='table-cell' style={{ width: '9%' }}>
                                        {formatDate(car.date_from)} 
                                        {car.date_to && formatDate(car.date_from) !== formatDate(car.date_to) && (
                                            <>  <div>{formatDate(car.date_to)}</div></>
                                        )}
                                    </td>
                                    
                                    <td className='table-cell' style={{ width: '5%' }}>{formatTime(car.time_from)}</td>
                                    <td className='table-cell' style={{ width: '5%' }}>{formatTime(car.time_to)}</td>
                                    <td className='table-cell' style={{ width: '9%' }}>{car.location}</td>
                                    <td className='table-cell' style={{ width: '5%' }}>{car.job_no}</td>
                                    <td className='table-cell' style={{ width: '2%' }}>{car.number_of_person}</td>
                                    <td className='table-cell' style={{ width: '2%' }}>{car.attendees ? car.attendees : '-'}</td>
                                    <td className='table-cell' style={{ width: '7%' }}>{car.driver} <div>{car.select_car && `(${car.select_car})`}</div></td>
                                    <td className='table-cell' style={{ width: '7%' }}>{car.driver_name ? car.driver_name : <span style={{ color: 'red' }}> Wait for HR to fill in data. </span>}</td>
                                    
                                    <td className='table-cell' style={{ width: '7%' }}>{car.type_car}</td>
                                    <td className='table-cell' style={{ width: '7%' }}>
                                        {car.registration ? car.registration :<span style={{ color: 'red' }}> Wait for HR to fill in data. </span>}
                                    </td>
                                    
                                    <td className='table-cell' style={{ width: '7%' }}>{car.branch}</td>
                                    <td className='table-cell' style={{ width: '11%' }}>{car.objective}</td>
                                   
                                </tr>
                            ))
                        
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CarTable;
