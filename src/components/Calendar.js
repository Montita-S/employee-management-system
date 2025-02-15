import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Navbar from '../Navbar';
import axios from 'axios';
import AddCalendar from './AddCalendar';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import '../Calendar.css'; 
import './popup.css'; 
import { BASE_URL } from '../config/apiConfig';
import { Link } from 'react-router-dom'; 
import { useUser } from '../UserContext'; 

const CalendarComponent = () => {  
    const { user } = useUser(); 
    const hasAccess = (requiredRoles) => requiredRoles.includes(user.role);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]); 
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState(null);
    
    useEffect(() => {
        const fetchCalendarEvents = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-calendar-events`);
                const events = response.data;
                setCalendarEvents(events);

                const today = new Date();
                const todayEvents = events.filter(event => {
                    const eventDateFrom = new Date(event.date_from);
                    const eventDateTo = event.date_to ? new Date(event.date_to) : eventDateFrom;

                    return (
                        today >= eventDateFrom &&
                        today <= eventDateTo
                    );
                });
    
                setEventsForSelectedDate(todayEvents);
                setSelectedDate(today); 
            } catch (error) {
                console.error('Error fetching calendar events:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchCalendarEvents();
    }, []);
    const getEventCounts = () => {
        const currentYear = new Date().getFullYear();
        let holidayDays = 0;
        let eventDays = 0;

        calendarEvents.forEach(event => {
            const eventDateFrom = new Date(event.date_from);
            const eventDateTo = event.date_to ? new Date(event.date_to) : eventDateFrom;

            if (
                eventDateFrom.getFullYear() === currentYear || 
                (eventDateTo && eventDateTo.getFullYear() === currentYear)
            ) {
                const daysInEvent = Math.ceil((eventDateTo - eventDateFrom) / (1000 * 60 * 60 * 24)) + 1;
                
                if (event.topic === 'Holiday & Sunday' || eventDateFrom.getDay() === 0) {
                    holidayDays += daysInEvent;
                } else {
                    eventDays += daysInEvent;
                }
            }
        });

        return { holidayDays, eventDays };
    };

    const { holidayDays, eventDays } = getEventCounts();

    const handleDeleteEvent = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/delete-calendar/${id}`);
            setCalendarEvents(calendarEvents.filter(event => event.id !== id));
            setDeleteConfirmId(null); 
        } catch (error) {
            console.error('Error deleting calendar event:', error);
        }
    };
    const getRemainingDays = () => {
        const currentYear = new Date().getFullYear();
        const today = new Date();
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31);
    
        const totalDaysInYear = Math.ceil((endOfYear - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
        let occupiedDays = 0;
    
        calendarEvents.forEach(event => {
            const eventDateFrom = new Date(event.date_from);
            const eventDateTo = event.date_to ? new Date(event.date_to) : eventDateFrom;

            if (
                eventDateFrom.getFullYear() === currentYear || 
                (eventDateTo && eventDateTo.getFullYear() === currentYear)
            ) {
                const from = eventDateFrom < startOfYear ? startOfYear : eventDateFrom;
                const to = eventDateTo > endOfYear ? endOfYear : eventDateTo;
    
                occupiedDays += Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
            }
        });
    
        const remainingDays = totalDaysInYear - occupiedDays;
        return remainingDays >= 0 ? remainingDays : 0;
    };

    const remainingDays = getRemainingDays();
    
    const handleDateClick = (date) => {
        setSelectedDate(date);

        const filteredEvents = calendarEvents.filter(event => {
            const eventDateFrom = new Date(event.date_from);
            const eventDateTo = event.date_to ? new Date(event.date_to) : eventDateFrom;

            return (
                date >= eventDateFrom &&
                date <= eventDateTo
            );
        });

        setEventsForSelectedDate(filteredEvents); 
    };

    const openAddEventModal = () => {
        setIsModalOpen(true); 
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; 
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatSelectedDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    const formatTime = (time) => {
        if (!time) return ''; 
        const [hours, minutes] = time.split(':');
        const formattedHours = hours.padStart(2, '0');
        return `${formattedHours}:${minutes}`;
    };
    const handleShowPopup = () => {
        const content = (
            <div>
                <div className='calendar-pop'><img src="/images/pink2.png" alt="time" className="pic-from" />{holidayDays} days : Holiday & Sunday</div>
                <div className='calendar-pop'><img src="/images/orange2.png" alt="time" className="pic-from" />{eventDays} days : Traditional Holiday</div>
                <div className='calendar-pop2'>{holidayDays + eventDays} : Total Holiday</div>
                <div className='calendar-pop'><img src="/images/white.png" alt="time" className="pic-from" />{remainingDays} : Working Days</div>
            </div>
        );
        setPopupContent(content);
        setPopupVisible(true);
    };
    const handleClosePopup = () => {
        setPopupVisible(false);
        setPopupContent(null);
    };
    
    return (
        <div>
            <Navbar />
            <div>
                <div className='calendar-container'>
                    <div className='calendar-header'>Calendar</div>
                    
                </div>
                <div className='cal-container'>
                
                    <Calendar
                        onClickDay={handleDateClick}
                        value={selectedDate}
                        tileClassName={({ date, view }) => {
                            if (view === 'month') { 

                                const matchingEvent = calendarEvents.find(event => {
                                    const eventDateFrom = new Date(event.date_from);
                                    const eventDateTo = event.date_to ? new Date(event.date_to) : eventDateFrom;

                                    return date >= eventDateFrom && date <= eventDateTo;
                                });

                                if (matchingEvent) {
                                    if (matchingEvent.topic === 'Holiday & Sunday' ) { //date.getDay() === 0 บอกว่าเป็นวันอาทิตย์
                                        return 'holiday-tile'; 
                                    }
                                    return 'event-tile';
                                }
                            }
                            return ''; 
                        }}
                    />
                

                    <AddCalendar
                        isOpen={isModalOpen}
                        onRequestClose={() => setIsModalOpen(false)}
                        onEventAdded={(newEvent) => setCalendarEvents([...calendarEvents, newEvent])}
                        selectedDate={selectedDate}
                    />
                </div>

                <div className="date-header">
                        <div className='topic'>{formatSelectedDate(selectedDate)}</div>
                        <div className={`${hasAccess(['human_resource']) ? '' : 'disabled'}`}>
                            <Link onClick={openAddEventModal} className="add-event-button">+</Link>
                        </div>
                </div>
                <div className="date-header">
                        <button className='holiday-button' onClick={handleShowPopup}>Summary Holiday in Year</button>

                        {popupVisible && (
                            <div className="popup-overlay" onClick={handleClosePopup}>
                                <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                                    {popupContent}
                                    <button className="popup-close" onClick={handleClosePopup}>Close</button>
                                </div>
                            </div>
                        )}
                </div>
                <div>
                    {eventsForSelectedDate.length > 0 && (
                        <div>
                            
                            <ul>
                                {eventsForSelectedDate.map((event) => (
                                    <div key={event.id} className="event-container">
                                        <div className="event-frame">
                                            <div className="event-frame2">
                                                <div className='topic'>{event.topic || "-"}</div>
                                               {/* <div className='mes'>
                                                    Date: {formatDate(event.date_from)}
                                                    {event.date_to && ` to ${formatDate(event.date_to)}`}
                                                </div>*/}
                                                <div>
                                                    {formatTime(event.time_from)}
                                                    {event.time_to && ` - ${formatTime(event.time_to)}`}
                                                </div>
                                                <div>
                                                   {/*  Added on: {formatDate(event.date_added)} at {formatTime(event.time_added)}*/}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${hasAccess(['human_resource']) ? '' : 'disabled'}`}>
                                            {deleteConfirmId === event.id ? (
                                                <>
                                                    <div className="popup-overlay" onClick={() => setDeleteConfirmId(null)}></div>

                                                    <div className="popup-confirmation">
                                                        <div className="pop-container">
                                                        <div className='pop-mes2'>Are you sure you want to delete?</div>
                                                            <div className="popup-buttons">
                                                                <button  onClick={() => handleDeleteEvent(event.id)}>Yes</button>
                                                                <button onClick={() => setDeleteConfirmId(null)}>No</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <img
                                                    src="/images/bin2.png"
                                                    alt="Delete"
                                                    className="delete-icon"
                                                    onClick={() => setDeleteConfirmId(event.id)}
                                                />
                                            )}
                                           
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarComponent;
