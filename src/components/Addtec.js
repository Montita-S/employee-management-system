import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
import './Addtec.css';

const Addtec = () => {
    const [technicalData, setTechnicalData] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const navigate = useNavigate();
    const [existingCourseName, setExistingCourseName] = useState('');

    useEffect(() => {
        const fetchTechnicalData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-tech`);
                setTechnicalData(response.data);
            } catch (error) {
                console.error('Error fetching technical data:', error);
            }
        };

        fetchTechnicalData();
    }, []);

    const handleCourseClick = (courseName) => {
        navigate(`/course-details/${courseName}`);
    };

    const handleAddTech = () => {
        const exists = technicalData.some(tech => tech.course_name === existingCourseName);
        if (exists) {
            alert('Course Name already exists! Please use a different name.');
        } else {
            navigate('/add-tech');
        }
    };

    const groupedTechnicalData = technicalData
        .filter(tech => selectedType === '' || tech.type === selectedType) 
        .reduce((acc, tech) => {
            const courseName = tech.course_name;
            if (!acc[courseName]) {
                acc[courseName] = [];
            }
            acc[courseName].push(tech);
            return acc;
        }, {});

    const uniqueTypes = [...new Set(technicalData.map(tech => tech.type))];

    return (
        <div>
            <Navbar />
            <div className='course-container'>
                <div className='head-mes2'>Add Technical Learning</div>
                <select
                    id="typeSelect"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className='course-select2'
                >
                    <option value="">All Types</option>
                    {uniqueTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                <div className="frame-container" onClick={handleAddTech}>
                    <img 
                        src="/images/tech.png" 
                        alt="tech"
                        className="add-image"
                    />
                    <div className="upload-button">
                        Click here to upload your Course
                    </div>
                </div>
            </div>

            <div className="course-frame">
                <div className="course-image-container">
                    <img 
                        src="/images/menu.png" 
                        alt="course"
                        className="course-image"
                    />
                </div>
                <div className='course-mes'>Added Courses</div>
                <div className="visitor-list">
                    {Object.entries(groupedTechnicalData).map(([courseName, techs]) => {
                        return (
                            <div className='course-card' key={courseName}>
                                <div className="course-info"  onClick={() => handleCourseClick(courseName)}>
                                    <div className="course-info-left">
                                        <img 
                                            src="/images/te.png" 
                                            alt="visitor"
                                            className="course-image3"
                                            
                                        />
                                        <div className='head-mes3'>
                                            <div>{courseName}</div>
                                            <div>{techs.length} Lesson</div> 
                                        </div>
                                    </div>
                                    {techs[0].image_coursecover && (
                                        <img 
                                            src={`${BASE_URL}/${techs[0].image_coursecover}`} 
                                            alt="Course Cover" 
                                            className='course-image2'
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Addtec;
