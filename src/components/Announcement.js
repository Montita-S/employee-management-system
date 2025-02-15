import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext'; 
import Navbar from '../Navbar';
import axios from 'axios';
import AddAnnouncement from './AddAnnouncement'; 
import EditAnnouncement from './EditAnnouncement';
import AnnouncementDetailsModal from './AnnouncementDetailsModal';
import { BASE_URL } from '../config/apiConfig';
import './Ann.css'; 

const Announcement = () => {  
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteMessage, setDeleteMessage] = useState(null);  

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
                    if (dateB - dateA !== 0) {
                        return dateB - dateA; 
                    }
                    const timeA = a.time_added ? a.time_added.split(':').map(Number) : [0, 0];
                    const timeB = b.time_added ? b.time_added.split(':').map(Number) : [0, 0];
    
                    const [hoursA, minutesA] = timeA;
                    const [hoursB, minutesB] = timeB;

                    if (hoursB !== hoursA) {
                        return hoursB - hoursA; 
                    }
                    return minutesB - minutesA;
                });
    
                setAnnouncements(sortedAnnouncements);
                setFilteredAnnouncements(sortedAnnouncements);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };
    
        fetchAnnouncements();
    }, []);
    
    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        const filtered = announcements.filter(announcement =>
            announcement.topic.toLowerCase().includes(searchTerm)
        );
        setFilteredAnnouncements(filtered);
    };

    const handleUpdate = (updatedAnnouncement) => {
        const updatedList = announcements.map(announcement => 
            announcement.id === updatedAnnouncement.id ? updatedAnnouncement : announcement
        );
        setAnnouncements(updatedList);
        setFilteredAnnouncements(updatedList); 
    };

    const handleEdit = (announcement) => {
        setCurrentAnnouncement(announcement);
        setIsEditModalOpen(true);
    };

    const handleDeleteConfirmation = (id) => {
        setDeleteMessage({
            id,
            message: 'Are you sure you want to delete?'
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/delete-announcement/${id}`);
            const updatedList = announcements.filter(announcement => announcement.id !== id);
            setAnnouncements(updatedList);
            setFilteredAnnouncements(updatedList); 
            alert('Announcement deleted successfully!');
        } catch (error) {
            console.error('Error deleting announcement:', error);
            alert('Failed to delete announcement.');
        }
        setDeleteMessage(null); 
    };

    const handleCancelDelete = () => {
        setDeleteMessage(null);
    };

    const handleShowDetails = (announcement) => {
        setCurrentAnnouncement(announcement);
        setIsDetailsModalOpen(true);
    };

    const formatTime = (time) => {
        if (!time) return ''; 
        const [hours, minutes] = time.split(':');
        const formattedHours = hours.padStart(2, '0');
        return `${formattedHours}:${minutes}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-'; 
        const options = { month: 'short', day: 'numeric' };
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', options).split(' ');
        return { month: formattedDate[0], day: formattedDate[1] };
    };
    
    return (
        <div>
            <Navbar />
            <div className='acc-container'>
                <div className='acc-inputs2'>
                    <img 
                        src="/images/Announcement2.png" 
                        alt="Announcement"
                        className="acc-image"
                    />
                    <div>
                        <div className='acc-mes'>Announcement</div>
                        <div className="search-container">
                            <i className="search-icon">🔍</i>
                            <input
                                type="text"
                                className="input-acc"
                                placeholder="Search Announcements"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>
                <AddAnnouncement
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                />

                <EditAnnouncement
                    isOpen={isEditModalOpen}
                    onRequestClose={() => setIsEditModalOpen(false)}
                    announcement={currentAnnouncement}
                    onUpdate={handleUpdate}
                />

                <AnnouncementDetailsModal
                    isOpen={isDetailsModalOpen}
                    onRequestClose={() => setIsDetailsModalOpen(false)}
                    announcement={currentAnnouncement}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    userRole={user.role}
                />

                <div className='acc-inputs'>
                    <div className='acc-mes'>Announcements</div>
                    <div className={` ${user.role === 'human_resource' ? '' : 'disabled'}`}>
                        <button className='acc-button' onClick={() => setIsModalOpen(true)}>+</button>
                    </div>
                </div>
                {filteredAnnouncements.length === 0 ? (
                    <p>No announcements available.</p>
                ) : (
                    <div className='acc-list'>
                        {filteredAnnouncements.map((announcement) => (
                            <div className='acc-list' key={announcement.id}>
                                <div className="date-container">
                                    <span>{formatDate(announcement.date_added).month}</span>
                                    <span>{formatDate(announcement.date_added).day}</span>
                                </div>
                                <div className='acc-card'>
                                    <div style={{ cursor: 'pointer' }} className='acc-mes2' onClick={() => handleShowDetails(announcement)}>
                                        {announcement.topic}
                                    </div>
                                    <div className='acc-mes3'> {formatTime(announcement.time_added)}</div>
                                </div>
                                {user.role === 'human_resource' && (
                                    <div>
                                        <button className='button-main' onClick={() => handleEdit(announcement)}>
                                            <img src="/images/edit3.png" alt="Edit" className="button-icon" />
                                        </button>
                                        <button className='button-main' onClick={() => handleDeleteConfirmation(announcement.id)}>
                                            <img src="/images/bin2.png" alt="Delete" className="button-icon" />
                                        </button>
                                    </div>
                                )}
                                {deleteMessage && (
                                    <>
                                        <div className="popup-overlay"></div>
                                        <div className="popup-confirmation">
                                            <div className="pop-container">
                                                <div className='pop-mes2'>{deleteMessage.message}</div>
                                                <div className="popup-buttons">
                                                    <button onClick={() => handleDelete(deleteMessage.id)}>Yes</button>
                                                    <button onClick={handleCancelDelete}>No</button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}


                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcement;
