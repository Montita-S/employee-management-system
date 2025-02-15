import React, { useState } from 'react';
import Announcement_sum from './Announcement_sum';
import Schedule_noti from './Schedule_noti';
import { useUser } from '../UserContext'; 
import Car_sum from './Car_sum';
import Visitor_sum from './Visitor_sum';
import Meeting_sum from './Meeting_sum';

const Summary_today = () => {
    const { user } = useUser(); 
    const hasAccess = (requiredRoles) => requiredRoles.includes(user.role);

    const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return 'th'; 
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const day = new Date().getDate();
    const month = new Date().toLocaleString('default', { month: 'short' });
    const year = new Date().getFullYear();
    const formattedDate = `${month} ${day}${getDaySuffix(day)}, ${year}`;


    return (
        <div>
            <div>
                <div>
                    <div className='visit-mes3'>Summary</div>
                    <div className='visit-mes2'>{formattedDate}</div>
                </div>
                <Announcement_sum />
                <Schedule_noti />
                <Car_sum />
                <Visitor_sum />
                <Meeting_sum/>
            </div>
        </div>
    );
};

export default Summary_today;
