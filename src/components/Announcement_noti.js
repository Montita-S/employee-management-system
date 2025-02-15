import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext'; 
import axios from 'axios';
import { BASE_URL } from '../config/apiConfig';
import './Ann.css'; 
import ProtectedRoute from '../ProtectedRoute';
import { Link } from 'react-router-dom';
const Announcement_noti = () => {  
    const { user } = useUser();
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);


    const formatTime = (time) => {
        if (!time) return ''; 
        const [hours, minutes] = time.split(':');
        const formattedHours = hours.padStart(2, '0');
        return `${formattedHours}:${minutes}`;
    };

    const isToday = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);
        return (
            today.getFullYear() === date.getFullYear() &&
            today.getMonth() === date.getMonth() &&
            today.getDate() === date.getDate()
        );
    };

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-announcements`);
                const announcementsWithFullPath = response.data.map(announcement => ({
                    ...announcement,
                    evidence_path: announcement.evidence_path ? `${BASE_URL}/${announcement.evidence_path}` : null
                }));

                const sortedAnnouncements = announcementsWithFullPath.sort((a, b) => {
                    const dateA = new Date(a.date_added);
                    const dateB = new Date(b.date_added);
                    return dateB - dateA; 
                });

                setAnnouncements(sortedAnnouncements);

                const todayAnnouncements = sortedAnnouncements.filter(announcement =>
                    isToday(announcement.date_added)
                );
                setFilteredAnnouncements(todayAnnouncements);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        fetchAnnouncements();
    }, []);


    return (
        <div>
            
                {filteredAnnouncements.length === 0 ? (
                    <p>No announcements for today.</p>
                ) : (
                    <div>
                        {filteredAnnouncements.map((announcement) => (
                            <div className="leave-request-frame" key={announcement.id} style={{marginTop:'5px'}}>
                                <Link to={`/announcement`} className="no-underline-link">    
                                    <div className='sch-inputs'>
                                        <div  className='noti-sch' >
                                            <strong>{announcement.topic}</strong>
                                        </div>
                                        <div  className='noti-sch'>{formatTime(announcement.time_added)}</div>
                                    </div>
                                </Link> 
                            </div>
                        ))}
                    </div>
                )}
            
        </div>
    );
};

export default Announcement_noti;
