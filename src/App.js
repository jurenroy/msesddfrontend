// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import SafetyRole from './Pages/SafetyRole/SafetyRole';
import ApplicationForm from './Pages/ApplicationForm/ApplicationForm';
import ExistingApplication from './Pages/ExistingApplication/ExistingApplication';
import TrackingDocument from './Pages/TrackingDocument/TrackingDocument';
import ExamList from './Pages/ExamList/Exam'; 
import Checklist from './Pages/Checklist/Checklist';
import ExamForm from './Pages/Eng-Ins-Exam/Eng-Ins Exam'
import MatchingExercise from './Pages/ExamSection2/ExamSection2'
import LoginForm from './Pages/Login/Login2';
import AdminDashboard from './Pages/Admin Dashboard/Adboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/Admin"  element={<AdminDashboard />} />
                <Route path="/safety/:role" element={<SafetyRole />} />
                <Route path="/safety/:role/new" element={<ApplicationForm />} /> {/* Updated route */}
                <Route path="/safety/:role/existing" element={<ExistingApplication />} />
                <Route path="/safety/:role/existing/:trackingcode" element={<TrackingDocument />} />
                <Route path="/safety/:role/existing/:trackingcode/checklist" element={<Checklist />} />
                <Route path="/safety/:role/existing/exams" element={<ExamList />} />
                <Route path="/safety/:role/existing/exam" element={<ExamForm />} />
                <Route path="/safety/:role/existing/exam/matching" element={<MatchingExercise />} />
                
            </Routes>
        </Router>
    );
}

export default App;