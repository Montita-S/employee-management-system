import React, { useState } from 'react';
import LeaveRequestsTab from './LeaveRequestsTab'; 
import SummaryOvertimeTab from './SummaryOvertimeTab';
import Announcement_sum from './Announcement_sum';
import Navbar from '../Navbar';
import './Tab.css';
import Schedule_sum from './Schedule_sum';
import Schedule_noti from './Schedule_noti';
import { useUser } from '../UserContext'; 
import Car_sum from './Car_sum';
import Visitor_sum from './Visitor_sum';
import Meeting_sum from './Meeting_sum';
import Summary_today from './Summary_today';
import CarTable from './car_table';
const Summary = () => {
    const [activeTab, setActiveTab] = useState('today');
    const { user } = useUser(); 
    const hasAccess = (requiredRoles) => requiredRoles.includes(user.role);
    
    return (
        <div>
            <Navbar />
            <div className="tabs-container1">
                
                <div className="tabs-nav1">
                    <button
                        className={`tab-button1 ${activeTab === 'today' ? 'active' : ''}`}
                        onClick={() => setActiveTab('today')}
                    >
                        Summary
                    </button>
                    {(['director', 'dept_manager', 'sec_manager', 'human_resource', 'act_manager'].includes(user.role) || 
                    (user.role === 'asst_manager' && ['Nawanakorn', 'HR/GA', 'Account'].includes(user.department))) && (
                        <button
                            className={`tab-button1 ${activeTab === 'leaveRequests' ? 'active' : ''}`}
                            onClick={() => setActiveTab('leaveRequests')}
                        >
                            Leave
                        </button>
                    )}

                    {(['director', 'dept_manager', 'sec_manager', 'human_resource', 'act_manager'].includes(user.role) || 
                    (user.role === 'asst_manager' && ['Nawanakorn', 'HR/GA', 'Account'].includes(user.department))) && (
                        <button
                            className={`tab-button1 ${activeTab === 'summaryOvertime' ? 'active' : ''}`}
                            onClick={() => setActiveTab('summaryOvertime')}
                        >
                            Overtime
                        </button>
                    )}

                     {(user.role === 'human_resource' || (user.role === 'asst_manager'&& user.department === 'HR/GA')) && (
                        <button
                            className={`tab-button1 ${activeTab === 'car_table' ? 'active' : ''}`}
                            onClick={() => setActiveTab('car_table')}
                        >
                            <img
                                src={activeTab === 'car_table' ? '/images/car_w.png' : '/images/car_b.png'}
                                alt="Car Reservation"
                                style={{ width: '35px', height: '30px' }} 
                            />
                        </button>
                    )}


                    {/*
                        <button
                            className={`tab-button1 ${activeTab === 'Announcement' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Announcement')}
                        >
                            Announcement
                        </button>
                        <button
                            className={`tab-button1 ${activeTab === 'Schedule' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Schedule')}
                        >
                            Schedule
                        </button>

                        <button
                            className={`tab-button1 ${activeTab === 'Car_sum' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Car_sum')}
                        >
                           Car_sum
                        </button>

                        <button
                            className={`tab-button1 ${activeTab === 'Visitor_sum' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Visitor_sum')}
                        >
                           Visitor_sum
                        </button>

                        <button
                            className={`tab-button1 ${activeTab === 'Meeting_sum' ? 'active' : ''}`}
                            onClick={() => setActiveTab('Meeting_sum')}
                        >
                            Meeting_sum
                        </button>
                    */}
                        
                    
                </div>

                <div className="tabs-content1">
                    {activeTab === 'today' && <Summary_today />}
                    {activeTab === 'leaveRequests' && <LeaveRequestsTab />}
                    {activeTab === 'summaryOvertime' && <SummaryOvertimeTab />}
                    {activeTab === 'car_table' && <CarTable />}
                    {/*
                    {activeTab === 'Announcement' && <Announcement_sum />}
                    {activeTab === 'Schedule' && <Schedule_noti />}
                    {activeTab === 'Car_sum' && <Car_sum />}
                    {activeTab === 'Visitor_sum' && <Visitor_sum />}
                    {activeTab === 'Meeting_sum' && <Meeting_sum />}
                    */}
                    
                </div>
            </div>
        </div>
    );
};

export default Summary;
