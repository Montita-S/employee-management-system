import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
import './Addtec.css';

const Technical = () => {  
    const [technicalData, setTechnicalData] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // New state for search query
    const navigate = useNavigate();

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

    const filteredTechnicalData = technicalData
        .filter(tech => {
            // Filter based on course name or type
            const matchesSearch = tech.course_name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === '' || tech.type === selectedType;
            return matchesSearch && matchesType;
        })
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
                <div className='head-mes2'>Technical Learning</div>
                <div className="search-and-select">
                <select
                        id="typeSelect"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className='course-select3'
                    >
                        <option value="">All Types</option>
                        {uniqueTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <div className="search-container1">
                        <i className="search-icon2">🔍</i>
                        <input
                            type="text"
                            placeholder="Search Courses"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="search-input2"
                        />
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
                <div className='course-mes'>Courses</div>
                <div className="visitor-list">
                    {Object.entries(filteredTechnicalData).map(([courseName, techs]) => {
                        return (
                            <div className='course-card' key={courseName}>
                                <div className="course-info" onClick={() => handleCourseClick(courseName)}>
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

export default Technical;
