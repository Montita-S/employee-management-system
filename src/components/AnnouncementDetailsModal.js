import React from 'react';
import Modal from 'react-modal';

const AnnouncementDetailsModal = ({
    isOpen,
    onRequestClose,
    announcement,
    onEdit,
    onDelete,
    userRole,
}) => {
    if (!isOpen) return null;
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
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}
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
        }}>
            <div className='acc-list' >
                <div className="date-container">
                    <div >{formatDate(announcement.date_added).month}</div>
                    <div >{formatDate(announcement.date_added).day}</div>
                </div>
                <div className='acc-card2'>
                    <div className='date-mes'>{announcement.topic}</div>
                    <div> {formatTime(announcement.time_added)}</div>
                </div>
            </div>
            <div className='acc-card3'>
                <p>{announcement.description}</p>
                {announcement.evidence_path && (
                    <div>
                        <strong>File : </strong>
                        <a href={announcement.evidence_path} target="_blank" rel="noopener noreferrer">
                            Click Link
                        </a>
                    </div>
                )}
            </div>
            {/*<button onClick={onRequestClose}>Close</button>*/}
        </Modal>
    );
};

export default AnnouncementDetailsModal;
