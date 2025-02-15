import "./App.css";
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
//import Employees from "./employees";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Profile from "./components/Profile";
import Calendar from "./components/Calendar";
import Schedule from "./components/Schedule";
import Daily from "./components/Daily";
import Leave from "./components/Leave";
import Documents from "./components/Documents";
import Visitor from "./components/Visitor";
import Meeting from "./components/Meeting";
import Car from "./components/Car";
import Training from "./components/Training";
import Out from "./components/Out";
import Technical from "./components/Technical";
import Announcement from "./components/Announcement";
import Addtec from "./components/Addtec";
import Awaiting from "./components/Awaiting";
import Allem from "./components/Allem";
import Contact from "./components/Contact";
import AdminSettings from "./AdminSettings";

import EmployeeDetail from "./components/EmployeeDetail";
import EditEmployee from "./components/EditEmployee";
import AddEmployee from "./components/Addemployee";
import AddLeave from "./components/AddLeave";
import AddOvertime from "./components/AddOvertime";
import Addvisitor from "./components/Addvisitor";
import AddCar from "./components/AddCar";
import AddMeeting from "./components/AddMeeting";
import AddAnnouncement from "./components/AddAnnouncement";
import AddTech from "./components/Addtech";
import CourseDetails from "./components/CourseDetails";
import AddSchedule from "./components/AddSchedule";
import AddAlldayLeave from "./components/AddAlldayLeave";
import EditLeave from "./components/EditLeave";
import VerifyCode from "./VerifyCode";
import Leave_copy from "./components/Leave_copy";
import Daily_copy from "./components/Daily_copy";
import AddDocuments from "./components/AddDocument";
import Summary from "./components/Summary";
import Leave_noti from "./components/Leave_noti";
import SummaryOvertime_noti from "./components/SummaryOvertime_noti";
import Feedback from "./components/Feedback";
function App() {
  
 return (
    <BrowserRouter basename="{'/employee-management-system'}">
      <Routes>
      <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} /> 
        <Route path="/summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} /> 
        <Route path="/leave_noti" element={<ProtectedRoute><Leave_noti /></ProtectedRoute>} /> 
        <Route path="/ot_noti" element={<ProtectedRoute><SummaryOvertime_noti /></ProtectedRoute>} /> 
        <Route path="/" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/verifyCode" element={<VerifyCode />} /> 
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
        <Route path="/daily/:id_employee" element={<ProtectedRoute><Daily /></ProtectedRoute>} />
        <Route path="/daily_copy/:id_employee" element={<ProtectedRoute><Daily_copy /></ProtectedRoute>} />

        <Route path="/leave/:id_employee" element={<ProtectedRoute><Leave /></ProtectedRoute>} />
        <Route path="/leave_copy/:id_employee" element={<ProtectedRoute><Leave_copy /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
        <Route path="/add-doc" element={<ProtectedRoute><AddDocuments /></ProtectedRoute>} />
        <Route path="/visitor" element={<ProtectedRoute><Visitor /></ProtectedRoute>} />
        <Route path="/meeting" element={<ProtectedRoute><Meeting /></ProtectedRoute>} />
        <Route path="/car" element={<ProtectedRoute><Car /></ProtectedRoute>} />
        <Route path="/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />
        <Route path="/out" element={<ProtectedRoute><Out /></ProtectedRoute>} />
        <Route path="/technical" element={<ProtectedRoute><Technical /></ProtectedRoute>} />
        <Route path="/announcement" element={<ProtectedRoute><Announcement /></ProtectedRoute>} />
        <Route path="/addtec" element={<ProtectedRoute><Addtec /></ProtectedRoute>} />
        <Route path="/awaiting" element={<ProtectedRoute><Awaiting /></ProtectedRoute>} />
        <Route path="/allem" element={<ProtectedRoute><Allem /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

        <Route path="/admin-settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

        <Route path="/add-employee" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
        <Route path="/employee/:id_employee" element={<ProtectedRoute><EmployeeDetail /></ProtectedRoute>} />

        <Route path="/employee/edit/:id" element={<ProtectedRoute><EditEmployee /></ProtectedRoute>} />

        <Route path="/addleave" element={<ProtectedRoute><AddLeave /></ProtectedRoute>} />
        <Route path="/add-overtime" element={<ProtectedRoute><AddOvertime /></ProtectedRoute>} />
        <Route path="/add-visitor" element={<ProtectedRoute><Addvisitor /></ProtectedRoute>} />
        <Route path="/add-car" element={<ProtectedRoute><AddCar /></ProtectedRoute>} />
        <Route path="/add-meeting" element={<ProtectedRoute><AddMeeting/></ProtectedRoute>} />
        <Route path="/add-announcement" element={<ProtectedRoute><AddAnnouncement/></ProtectedRoute>} />
        <Route path="/add-tech" element={<ProtectedRoute><AddTech/></ProtectedRoute>} />
        <Route path="/course-details/:courseName" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} /> 
        <Route path="/add-schedule" element={<ProtectedRoute><AddSchedule/></ProtectedRoute>} />
        <Route path="/add-allday-leave/:employeeId" element={<ProtectedRoute><AddAlldayLeave /></ProtectedRoute>} />
        <Route path="/edit-leave" element={<ProtectedRoute><EditLeave/></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
