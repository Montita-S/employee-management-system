import React from 'react';
import Navbar from './Navbar'; 
import './Home.css'; 
import { Link } from 'react-router-dom'; 
import { useUser } from './UserContext'; 

const Home = () => {
    const { user } = useUser(); 
    const hasAccess = (requiredRoles) => requiredRoles.includes(user.role);
    return (
        <div>
            <Navbar />
            
            <div className="blocks">
          
                {/*<h1>Hello, {user.id_employee}!</h1>*/}
                <div className="block-container">  
                    <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                        'director','general_manager', 'dept_manager', 
                                                        'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                        'act_manager']) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                             'director','general_manager', 'dept_manager', 
                                             'sec_manager', 'asst_manager','supervisor', 
                                             'employee','act_manager']) ? "/profile" : "#"}>
                            <img src="/images/profile.png" alt="Profile" className="block-image" />
                        </Link>
                    </div>
                    <p className="block-message">Profile</p> 
                </div>

                <div className="block-container">
                    <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                        'director','general_manager', 'dept_manager', 
                                                        'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                        'human_resource','act_manager']) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                             'director','general_manager', 'dept_manager', 
                                             'sec_manager', 'asst_manager','supervisor', 
                                             'employee', 'human_resource','act_manager']) ? "/calendar" : "#"}>
                            <img src="/images/calendar.png" alt="Calendar" className="block-image" />
                        </Link>
                    </div>
                    <p className="block-message">Calendar</p> 
                </div>

                <div className="block-container">
                    <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                        'director','general_manager', 'dept_manager', 
                                                        'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                       'act_manager']) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                             'director','general_manager', 'dept_manager', 
                                             'sec_manager', 'asst_manager','supervisor', 
                                             'employee','act_manager']) ? "/schedule" : "#"}>
                            <img src="/images/Sch.png" alt="Schedule" className="block-image" />
                        </Link>
                    </div>
                    <p className="block-message">Schedule</p> 
                </div>


                <div className="block-container">
                    <div className={`block ${hasAccess(['admin', 'supervisor', 'employee', 
                                                        ]) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin', 'supervisor', 'employee']) ? `/daily/${user.id_employee}` : "#"}>
                            <img src="/images/Daily.png" alt="Record Daily Work" className="block-image" />
                        </Link>

                    </div>
                    <p className="block-message">Record Daily Work</p> 
                </div>

                <div className="block-container">
                    <div className={`block ${hasAccess(['admin', 'asst_manager', 'supervisor', 'employee', 
                                                        ]) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin',  'asst_manager', 'supervisor', 'employee', 
                                            ]) 
                                ? `/leave/${user.id_employee}` 
                                : "#"}>
                            <img src="/images/Leave.png" alt="Record Leave" className="block-image" />
                        </Link>
                    </div>
                    <p className="block-message">Record Leave</p> 
                </div>
                {user.role === 'admin' && (
                    <div className="block-container">
                        <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                            'director','general_manager', 'dept_manager', 
                                                            'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                            'human_resource','act_manager']) ? '' : 'disabled'}`}>
                            <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                                'director','general_manager', 'dept_manager', 
                                                'sec_manager', 'asst_manager','supervisor', 
                                                'employee', 'human_resource','act_manager']) ? "/documents" : "#"}>
                                <img src="/images/Documents.png" alt="Documents" className="block-image" />
                            </Link>
                        </div>
                        <p className="block-message">Documents</p> 
                    </div>
                )}
                <div className="block-container">
                    <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                        'director','general_manager', 'dept_manager', 
                                                        'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                        'human_resource','act_manager']) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                             'director','general_manager', 'dept_manager', 
                                             'sec_manager', 'asst_manager','supervisor', 
                                             'employee', 'human_resource','act_manager']) ? "/visitor" : "#"}>
                            <img src="/images/Visitor.png" alt="Visitor" className="block-image" />
                        </Link>
                    </div>
                    <p className="block-message">Visitor</p> 
                </div>

                <div className="block-container">
                    <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                        'director','general_manager', 'dept_manager', 
                                                        'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                        'human_resource','act_manager']) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                             'director','general_manager', 'dept_manager', 
                                             'sec_manager', 'asst_manager','supervisor', 
                                             'employee', 'human_resource','act_manager']) ? "/meeting" : "#"}>
                            <img src="/images/Meeting.png" alt="Meeting Room" className="block-image" />
                        </Link>
                    </div>
                    <p className="block-message">Meeting Room</p> 
                </div>

                <div className="block-container">
                    <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                        'director','general_manager', 'dept_manager', 
                                                        'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                        'human_resource','act_manager']) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                             'director','general_manager', 'dept_manager', 
                                             'sec_manager', 'asst_manager','supervisor', 
                                             'employee', 'human_resource','act_manager']) ? "/car" : "#"}>
                            <img src="/images/Car.png" alt="Car Reservation" className="block-image" />
                        </Link>
                    </div>
                    <p className="block-message">Car Reservation</p> 
                </div>
                {user.role === 'admin' && (
                    <div className="block-container">
                        <div className={`block ${hasAccess(['admin']) ? '' : 'disabled'}`}>
                            <Link to={hasAccess(['admin']) ? "/training" : "#"}>
                                <img src="/images/Training.png" alt="Request Seminar" className="block-image" />
                            </Link>
                        </div> 
                        <div className="block-message">Request</div>
                        <div className="block-submessage">Seminar/Training</div>                  
                    </div>
                )}
             
             {user.role === 'admin' && (
                <div className="block-container">
                    <div className={`block ${hasAccess(['admin']) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin']) ? "/out" : "#"}>
                            <img src="/images/Out.png" alt="Out of Goods" className="block-image" />
                        </Link>
                    </div>
                    <p className="block-message">Out of Goods</p> 
                </div>
             )}

                <div className="block-container">
                    <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                        'director','general_manager', 'dept_manager', 
                                                        'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                        'act_manager']) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                             'director','general_manager', 'dept_manager', 
                                             'sec_manager', 'asst_manager','supervisor', 
                                             'employee','act_manager']) ? "/technical" : "#"}>
                            <img src="/images/Technical.png" alt="Technical Learning" className="block-image" />
                        </Link>
                    </div>
                    <p className="block-message">Technical Learning</p> 
                </div>
                
                <div className="block-container">
                    <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                        'director','general_manager', 'dept_manager', 
                                                        'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                        'human_resource','act_manager']) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                             'director','general_manager', 'dept_manager', 
                                             'sec_manager', 'asst_manager','supervisor', 
                                             'employee', 'human_resource','act_manager']) ? "/announcement" : "#"}>
                            <img src="/images/Announcement.png" alt="Announcement" className="block-image" />
                        </Link>
                    </div>
                    <p className="block-message">Announcement</p> 
                </div>
                <div className="block-container">
                    <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                        'director','general_manager', 'dept_manager', 
                                                        'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                        'act_manager', 'human_resource']) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                             'director','general_manager', 'dept_manager', 
                                             'sec_manager', 'asst_manager','supervisor', 
                                             'employee', 'act_manager', 'human_resource']) ? "/contact" : "#"}>
                           <img src="/images/Contact.png" alt="Contact List" className="block-image" />
                        </Link>
                    </div>
                    <p className="block-message">Contact List</p> 
                </div>
                <div className="block-container" style={{marginTop:'10px'}}>
                    <div className={`block ${hasAccess([
                                                        'dept_manager', 'sec_manager','act_manager']) ? '' : 'disabled'}`}>
                        <Link to={hasAccess([ 'dept_manager', 
                                             'sec_manager','act_manager']) ? "/addtec" : "#"}>
                            <img src="/images/Add.png" alt="Add Technical Learning" className="block-image" />
                        </Link>
                    </div>
                    <div className="block-message">Add Technical</div> 
                    <div className="block-submessage">Learning</div> 
                </div>
                <div className="block-container" style={{ marginTop: '10px' }}>
                    <div
                        className={`block  ${
                            hasAccess(['admin', 'director', 'dept_manager', 'sec_manager', 'asst_manager', 'human_resource', 'act_manager']) &&
                            (user.role !== 'asst_manager' || 
                            (user.role === 'asst_manager' && 
                            ['Nawanakorn', 'HR/GA', 'Account'].includes(user.department))) 
                            ? '' 
                            : 'disabled'
                        }`}
                    >
                        <Link
                            to={
                                hasAccess(['admin', 'director', 'dept_manager', 'sec_manager', 'asst_manager', 'human_resource', 'act_manager']) &&
                                (user.role !== 'asst_manager' || 
                                (user.role === 'asst_manager' && 
                                ['Nawanakorn', 'HR/GA', 'Account'].includes(user.department)))
                                    ? "/awaiting"
                                    : "#"
                            }
                        >
                            <img src="/images/Awaiting .png" alt="Awaiting Verification" className="block-image" />
                        </Link>
                    </div>
                    <div className="block-message">Awaiting</div>
                    <div className="block-submessage">Verification</div>
                </div>
                {/*
                <div className="block-container"style={{marginTop:'10px'}} >
                    <div className={`block  ${hasAccess(['admin', 
                                                        'director', 'dept_manager', 
                                                        'sec_manager', 'asst_manager',
                                                        'human_resource','act_manager']) ? '' : 'disabled'}` }>
                        <Link to={hasAccess(['admin', 
                                             'director', 'dept_manager', 
                                             'sec_manager', 'asst_manager',
                                             'human_resource','act_manager']) ? "/awaiting" : "#"}>
                            <img src="/images/Awaiting .png" alt=" Awaiting Verification" className="block-image" />
                        </Link>
                    </div>
                    <div className="block-message"> Awaiting</div>
                    <div className="block-submessage">Verification</div> 
                </div>*/}
                
                <div className="block-container">
                    <div
                        className={`block  ${
                            hasAccess(['admin', 'chairman', 'manager_director', 
                                                        'director','general_manager', 'dept_manager', 
                                                        'sec_manager', 'asst_manager',
                                                        'human_resource','act_manager']) &&
                            (user.role !== 'asst_manager' || 
                            (user.role === 'asst_manager' && 
                            ['Nawanakorn', 'HR/GA', 'Account'].includes(user.department))) 
                            ? '' 
                            : 'disabled'
                        }`}
                    >
                        <Link
                            to={
                                hasAccess(['admin', 'chairman', 'manager_director', 
                                                        'director','general_manager', 'dept_manager', 
                                                        'sec_manager', 'asst_manager',
                                                        'human_resource','act_manager']) &&
                                (user.role !== 'asst_manager' || 
                                (user.role === 'asst_manager' && 
                                ['Nawanakorn', 'HR/GA', 'Account'].includes(user.department)))
                                    ? "/allem"
                                    : "#"
                            }
                        >
                        
                   {/* <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                        'director','general_manager', 'dept_manager', 
                                                        'sec_manager', 'asst_manager',
                                                        'human_resource','act_manager']) ? '' : 'disabled'}`}>
                        <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                             'director','general_manager', 'dept_manager', 
                                             'sec_manager', 'asst_manager',
                                             'human_resource','act_manager']) ? "/allem" : "#"}>*/}
                            <img src="/images/All.png" alt="All Employees" className="block-image" />
                        </Link>
                    </div>
                    <p className="block-message">All Employees</p> 
                </div>

                
                
                {user.role === 'admin' && (
                    <div className="block-container">
                        <div className="block">
                            <Link to="/admin-settings">
                                <img src="/images/admin.png" alt="Admin Settings" className="block-image" />
                            </Link>
                        </div>
                        <p className="block-message">Admin Settings</p>
                    </div>
                )}
                <div className="block-container">
                    <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                            'director','general_manager', 'dept_manager', 
                                                            'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                            'human_resource','act_manager']) ? '' : 'disabled'}`}>
                            <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                                'director','general_manager', 'dept_manager', 
                                                'sec_manager', 'asst_manager','supervisor', 
                                                'employee', 'human_resource','act_manager']) ? "/summary" : "#"}>
                                <img src="/images/summ.png" alt="summary" className="block-image" />
                            </Link>
                        </div>
                        <p className="block-message">Summary</p>
                </div>
                <div className="block-container">
                    <div className={`block ${hasAccess(['admin', 'chairman', 'manager_director', 
                                                            'director','general_manager', 'dept_manager', 
                                                            'sec_manager', 'asst_manager','supervisor', 'employee', 
                                                            'human_resource','act_manager']) ? '' : 'disabled'}`}>
                            <Link to={hasAccess(['admin', 'chairman', 'manager_director',
                                                'director','general_manager', 'dept_manager', 
                                                'sec_manager', 'asst_manager','supervisor', 
                                                'employee', 'human_resource','act_manager']) ? "/feedback" : "#"}>
                                <img src="/images/feedback.png" alt="feedback" className="block-image" />
                            </Link>
                        </div>
                        <p className="block-message">Feedback</p>
                </div>
          
             
            </div>
            <br/>
        </div>
    );
};

export default Home;
