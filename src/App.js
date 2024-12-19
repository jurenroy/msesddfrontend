// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import SafetyRole from './Pages/SafetyRole/SafetyRole';
import ApplicationForm from './Pages/ApplicationForm/ApplicationForm';
import ExistingApplication from './Pages/ExistingApplication/ExistingApplication';
import TrackingDocument from './Pages/TrackingDocument/TrackingDocument';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/safety/:role" element={<SafetyRole />} />
                <Route path="/safety/:role/new" element={<ApplicationForm />} /> {/* Updated route */}
                <Route path="/safety/:role/existing" element={<ExistingApplication />} />
                <Route path="/safety/:role/existing/:trackingcode" element={<TrackingDocument />} />
            </Routes>
        </Router>
    );
}

export default App;