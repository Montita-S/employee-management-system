import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext'; 
import axios from 'axios';
import AnnouncementDetailsModal from './AnnouncementDetailsModal';
import { BASE_URL } from '../config/apiConfig';
import './Ann.css'; 

const Announcement_sum = () => {  
    const { user } = useUser();
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '-'; 
        const options = { month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', options).split(' ');
        return { month: formattedDate[0], day: formattedDate[1] };
    };

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

    const handleShowDetails = (announcement) => {
        setCurrentAnnouncement(announcement);
        setIsDetailsModalOpen(true);
    };

    return (
        <div>
            
                <AnnouncementDetailsModal
                    isOpen={isDetailsModalOpen}
                    onRequestClose={() => setIsDetailsModalOpen(false)}
                    announcement={currentAnnouncement}
                    userRole={user.role}
                />
                {filteredAnnouncements.length > 0 && (
                    <div className='head-mess10'>Announcement</div>
                )}
                {filteredAnnouncements.length === 0 ? (
                    null
                ) : (
                    <div>
                        {filteredAnnouncements.map((announcement) => (
                            <div className="ann-request-frame" key={announcement.id}>
                                <div className='allem-inputs'>
                                    <div 
                                        style={{ cursor: 'pointer' }} 
                                         className='noti-sch'
                                        onClick={() => handleShowDetails(announcement)}
                                    >
                                        <strong>{announcement.topic}</strong>
                                    </div>
                                    <div className='noti-sch'>{formatTime(announcement.time_added)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            
        </div>
    );
};

export default Announcement_sum;
