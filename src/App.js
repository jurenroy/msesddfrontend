import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import ApplicationForm from './Pages/ApplicationForm/ApplicationForm';
import ExistingApplication from './Pages/ExistingApplication/ExistingApplication';
import TrackingDocument from './Pages/TrackingDocument/TrackingDocument';
import ExamList from './Pages/Exams/ExamList'; 
import Checklist from './Pages/Checklist/Checklist';
import ExamPage from './Pages/Exams/StartExam';
import LoginForm from './Pages/Login/Login';
import AdminDashboard from './Pages/Admin Dashboard/Adboard';
import ResultsPage from "./Pages/Exams/ExamResults";
import UserDash from './Pages/UserDashboard/UserDash';
import { Provider } from 'react-redux';
import { store, persistor } from './/Redux/store';
import { PersistGate } from 'redux-persist/integration/react';
function App() {
    return (
        <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/Admin"  element={<AdminDashboard />} />
                        <Route path="/safety/:role"/>
                        <Route path="/safety/:role/new" element={<ApplicationForm />} /> {/* Updated route */}
                        <Route path="/safety/:role/existing" element={<ExistingApplication />} />
                        <Route path="/safety/:role/dashboard" element={<UserDash />} />
                        <Route path="/safety/:role/existing/:trackingcode" element={<TrackingDocument />} />
                        <Route path="/safety/:role/existing/:trackingcode/checklist" element={<Checklist />} />
                        <Route path="/safety/:role/existing/exam_list" element={<ExamList />} />
                        <Route path="/safety/:role/existing/exam/:examId" element={<ExamPage />} />
                        <Route path="/safety/:role/existing/exam/results"element={<ResultsPage />}/>
                        
                    </Routes>
                </Router>
            </PersistGate>
        </Provider>
    );
}

export default App;