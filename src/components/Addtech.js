import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/apiConfig';
import './AddTech.css';

const AddTech = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [numberOfLessons, setNumberOfLessons] = useState('');
    const [courseName, setCourseName] = useState('');
    const [courseCoverImage, setCourseCoverImage] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleCategoryChange = (e) => setCategory(e.target.value);

    const handleLessonChange = (index, field, value) => {
        const updatedLessons = [...lessons];
        updatedLessons[index] = { ...updatedLessons[index], [field]: value };
        setLessons(updatedLessons);
    };

    const handleFileChange = (index, e) => {
        const updatedLessons = [...lessons];
        const fileType = e.target.name;
        updatedLessons[index] = { ...updatedLessons[index], [fileType]: e.target.files[0] };
        setLessons(updatedLessons);
    };

    const handleNumberOfLessonsChange = (e) => {
        const num = e.target.value;
        setNumberOfLessons(num);
        
        const newLessons = Array.from({ length: num }, () => ({
            lessonName: '',
            evidenceVideo: null,
            evidencePDF: null,
            imageLessonCover: null
        }));
        setLessons(newLessons);
    };

    const handleCourseCoverChange = (e) => {
        setCourseCoverImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        try {
            for (let i = 0; i < lessons.length; i++) {
                const lessonFormData = new FormData();
                lessonFormData.append('category', category);
                lessonFormData.append('type', type);
                lessonFormData.append('description', description);
                lessonFormData.append('number_of_lessons', numberOfLessons);
                lessonFormData.append('course_name', courseName);
                lessonFormData.append('lesson_name', lessons[i].lessonName);
                
                if (lessons[i].evidenceVideo) {
                    lessonFormData.append('evidence_video', lessons[i].evidenceVideo);
                }
                if (lessons[i].evidencePDF) {
                    lessonFormData.append('evidence_pdf', lessons[i].evidencePDF);
                }
                if (lessons[i].imageLessonCover) {
                    lessonFormData.append('image_lessoncover', lessons[i].imageLessonCover);
                }
                if (courseCoverImage) {
                    lessonFormData.append('image_coursecover', courseCoverImage);
                }

                const response = await axios.post(`${BASE_URL}/add-tech`, lessonFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log(`Lesson ${i + 1} added successfully`, response.data);
            }
            alert('All lessons added successfully');
            navigate('/addtec');
            
        } catch (error) {
            console.error('Error adding lessons:', error);
            alert('Failed to add lessons');
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div>
            <Navbar />
            <div className="add-tech-container">
                
                <h2 className="form-title">Add Technical Learning</h2>
                <form onSubmit={handleSubmit} className="tech-form-frame">
                    <div className="form-group">
                        <label>Category:</label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    value="Read"
                                    checked={category === 'Read'}
                                    onChange={handleCategoryChange}
                                />
                                <span className="checkbox-text">Read</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Video"
                                    checked={category === 'Video'}
                                    onChange={handleCategoryChange}
                                />
                                <span className="checkbox-text">Video</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Type:</label>
                        <input
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="input-1"
                            required
                            placeholder='Enter Type'
                        />
                    </div>

                    <div className="form-group">
                        <label>Course Name:</label>
                        <input
                            type="text"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            className="input-1"
                            required
                            placeholder='Enter Course Name'
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-1"
                            required
                            placeholder='Enter Description'
                        />
                    </div>


                    <div className="form-group">
                        <label>Course Cover Image:</label>
                        <input
                            type="file"
                            name="imageCourseCover"
                            onChange={handleCourseCoverChange}
                            className="input-1"
                            
                        />
                    </div>

                    <div className="form-group">
                        <label>Number of Lessons:</label>
                        <input
                            type="number"
                            value={numberOfLessons}
                            onChange={handleNumberOfLessonsChange}
                            className="input-1"
                            required
                            placeholder='Enter Number of Lessons'
                        />
                    </div>

                    {lessons.map((lesson, index) => (
                        <div key={index} className="lesson-file-inputs">
                            <div className="form-group">
                                <label>Lesson Name:</label>
                                <input
                                    type="text"
                                    value={lesson.lessonName}
                                    onChange={(e) => handleLessonChange(index, 'lessonName', e.target.value)}
                                    className="input-1"
                                    required
                                    placeholder='Enter Lesson Name'
                                />
                            </div>
                            <div className="form-group">
                                <label>Lesson Cover Image:</label>
                                <input
                                    type="file"
                                    name="imageLessonCover"
                                    onChange={(e) => handleFileChange(index, e)}
                                    className="input-1"
                                />
                            </div>
                            {category === 'Read' ? (
                                <div className="form-group">
                                    <label>Evidence File (PDF):</label>
                                    <input
                                        type="file"
                                        name="evidencePDF"
                                        onChange={(e) => handleFileChange(index, e)}
                                        className="input-1"
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label>Evidence File (Video):</label>
                                    <input
                                        type="file"
                                        name="evidenceVideo"
                                        onChange={(e) => handleFileChange(index, e)}
                                        className="input-1"
                                        required
                                    />
                                </div>
                            )}

                            
                        </div>
                    ))}

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Technical Data'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTech;
