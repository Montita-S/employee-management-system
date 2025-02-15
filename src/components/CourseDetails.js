import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
import './Course.css';
import Navbar from '../Navbar';
import { useUser } from '../UserContext';

const CourseDetails = () => {
    const { user } = useUser();
    const hasAccess = (requiredRoles) => requiredRoles.includes(user.role);
    const { courseName } = useParams();
    const [courseDetails, setCourseDetails] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-tech/${courseName}`);
                setCourseDetails(response.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        fetchCourseDetails();
    }, [courseName]);

    const handleDeleteTech = async () => {
        try {
            await axios.delete(`${BASE_URL}/delete-tech/${confirmDelete.id}`);
            setCourseDetails((prevDetails) => prevDetails.filter(tech => tech.id !== confirmDelete.id));
            alert('Technical request deleted successfully.');
            navigate('/addtec');
        } catch (error) {
            console.error('Error deleting technical request:', error);
            alert('Failed to delete technical request.');
        } finally {
            setConfirmDelete({ show: false, id: null });
        }
    };

    // Group details by description and then by category
    const groupedDetails = courseDetails.reduce((acc, tech) => {
        if (!acc[tech.description]) {
            acc[tech.description] = {
                imageCourseCover: tech.image_coursecover,
                categories: {},
            };
        }
        if (!acc[tech.description].categories[tech.category]) {
            acc[tech.description].categories[tech.category] = [];
        }
        acc[tech.description].categories[tech.category].push(tech);
        return acc;
    }, {});

    const handleFileOpen = (tech) => {
        if (tech.evidencePath_video) {
            window.open(`${BASE_URL}/${tech.evidencePath_video}`, '_blank');
        } else if (tech.evidencePath_pdf) {
            window.open(`${BASE_URL}/${tech.evidencePath_pdf}`, '_blank');
        }
    };

    return (
        <div>
            <Navbar />
            <div className='detail-container'>
                

                {Object.keys(groupedDetails).map((description) => (
                    <div key={description} className="course-detail">
                        {groupedDetails[description].imageCourseCover && (
                            <div className='detail-container2'>
                                <img
                                    src={`${BASE_URL}/${groupedDetails[description].imageCourseCover}`}
                                    alt="Course Cover"
                                    className='cover-image'
                                />
                            </div>
                        )}
                        <div className='sub-mes'>{courseName}</div>
                        <div className='sub-mes2'><strong>Description</strong></div>
                        <div>⠀ ⠀ ⠀ {description}</div>

                        {Object.keys(groupedDetails[description].categories).map((category) => (
                            <div key={category}>
                                <div className='detail-inputs'>
                                    <div>{groupedDetails[description].categories[category].length} Lesson</div>
                                    {category === 'Read' && <img src="/images/read.png" alt="Read Category" className='read-image' />}
                                    {category === 'Video' && <img src="/images/video.png" alt="Video Category" width="50" />}
                                </div>
                                <div className="acc-list3">
                                {groupedDetails[description].categories[category].map((tech) => (
                                    
                                    <div className='acc-list2' key={tech.id}>
                                        <div className='detail-card' onClick={() => handleFileOpen(tech)}>
                                            <div className='acc-list'>
                                                {tech.image_lessoncover && <img src={`${BASE_URL}/${tech.image_lessoncover}`} alt="Lesson Cover" className='lesson-image'/>}
                                                <div className='sub-mes3'>{tech.lesson_name}</div>
                                            </div>
                                        </div>
                                        <div className={` ${hasAccess([ 'dept_manager', 
                                                        'sec_manager', 'act_manager']) ? '' : 'disabled'}`}>
                                            <div>
                                                <button className='button-main2' onClick={() => setConfirmDelete({ show: true, id: tech.id })}>
                                                    <img src="/images/bin2.png" alt="Delete" className="button-icon2" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                {confirmDelete.show && (
                    <div className="confirmation-overlay">
                        <div className="confirmation-dialog">
                            <p>Are you sure you want to delete?</p>
                            <button className='conbutton-yes' onClick={handleDeleteTech}>Yes</button>
                            <button className='conbutton-no' onClick={() => setConfirmDelete({ show: false, id: null })}>No</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetails;
