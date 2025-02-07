// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import SafetyRole from './Pages/SafetyRole/SafetyRole';
import ApplicationForm from './Pages/ApplicationForm/ApplicationForm';
import ExistingApplication from './Pages/ExistingApplication/ExistingApplication';
import TrackingDocument from './Pages/TrackingDocument/TrackingDocument';
import Checklist from './Pages/Checklist/Checklist';
import ExamForm from './Pages/Eng-Ins-Exam/Eng-Ins Exam'
import MatchingExercise from './Pages/ExamSection2/ExamSection2'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/safety/:role" element={<SafetyRole />} />
                <Route path="/safety/:role/new" element={<ApplicationForm />} /> {/* Updated route */}
                <Route path="/safety/:role/existing" element={<ExistingApplication />} />
                <Route path="/safety/:role/existing/:trackingcode" element={<TrackingDocument />} />
                <Route path="/safety/:role/existing/:trackingcode/checklist" element={<Checklist />} />
                <Route path="/safety/:role/existing/exam" element={<ExamForm />} />
                <Route path="/safety/:role/existing/exam/matching" element={<MatchingExercise />} />
            </Routes>
        </Router>
    );
}

export default App;