import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import NotifSubmit from './Pages/ApplicationForm/NotiSubmit'; // Import the NotifSubmit component
import { Provider } from 'react-redux';
import { store, persistor } from './/Redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import PrivateRoute from './PrivateRoute';

function App() {
    // Access the auth state from the Redux store
    const authState = store.getState().auth; // Assuming your auth state is in the 'auth' slice
    console.log(authState)
    const isLoggedIn = authState && typeof authState === 'object' && 'isLoggedIn' in authState
    ? authState.isLoggedIn
    : false; // Default to false if not logged in
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={!isLoggedIn ? <LoginForm /> : <Navigate to="/Admin" />} />
                        <Route path="/Admin" element={<PrivateRoute element={<AdminDashboard />} isLoggedIn={isLoggedIn} />} />
                        <Route path="/safety/:role"/>
                        <Route path="/safety/:role/new" element={<ApplicationForm />} /> {/* Updated route */}
                        <Route path="/safety/:role/existing" element={<ExistingApplication />} />
                        <Route path="/safety/:role/dashboard" element={<UserDash />} />
                        <Route path="/safety/:role/existing/:trackingcode" element={<TrackingDocument />} />
                        <Route path="/safety/:role/existing/:trackingcode/checklist" element={<Checklist />} />
                        <Route path="/safety/:role/existing/exam_list" element={<ExamList />} />
                        <Route path="/safety/:role/existing/exam/:examId" element={<ExamPage />} />
                        <Route path="/safety/:role/existing/exam/results" element={<ResultsPage />}/>
                        <Route path="/submission-success" element={<NotifSubmit />} /> {/* Added new route for NotifSubmit */}
                    </Routes>
                </Router>
            </PersistGate>
        </Provider>
    );
}

export default App;