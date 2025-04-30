import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import './Home.css'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { login, logout } from '../../Redux/Auth/AuthSlice';  

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    
    // State to manage popup visibility and selected role
    const [popupRole, setPopupRole] = useState(null);

    // Define qualifications for each role
    const qualifications = {
        Engineer: {
            permanent: [
                "A duly registered and currently licensed Mining Engineer with at least <span class=\"highlight\">one (1) year supervisory experience in mining/quarrying operations and/or mine safety work;</span> or",
                "A duly registered and currently licensed Engineer, Geologist or Chemist with at least <span class=\"highlight\">five (5) years experience in mining/quarrying operations and/or mine safety work.</span>"
            ],
            temporary: [
                "Any duly registered and currently licensed Engineer, Geologist or Chemist with at least <span class=\"highlight\">two (2) years experience as Safety Inspector preferably in the employ of the company.</span>"
            ]
        },
        Inspector: {
            permanent: [
                "A graduate in any Engineering course with at least <span class=\"highlight\">two (2) years experience in safety inspection</span> or <span class=\"highlight\">three (3) years experience in mining operations</span>; or",
                "A college undergraduate in any Engineering course with at least <span class=\"highlight\">three (3) years experience in safety inspection</span> or <span class=\"highlight\">four (4) years experience in mining operations</span>; or",
                "At least high school graduate with <span class=\"highlight\">five (5) years experience in safety inspection</span> or <span class=\"highlight\">six (6) years experience in mining operations</span>."
            ],
            temporary: [
                "A graduate in any Engineering course with <span class=\"highlight\">one (1) year experience in safety inspection</span> or <span class=\"highlight\">two (2) years experience in mining operation</span>; or",
                "A college undergraduate in any Engineering course with at least <span class=\"highlight\">two (2) years experience in safety inspection</span> or <span class=\"highlight\">three (3) years experience in mining operation</span>; or",
                "At least high school graduate with <span class=\"highlight\">three (3) years experience in safety inspection</span> or <span class=\"highlight\">four (4) years experience in mining operation</span>."
            ]
        }
    };

    const handleRoleClick = (role) => {
        setPopupRole(role);
    };

    const handleButtonClick = (action) => {
        // Close popup first
        setPopupRole(null);
        
        // Navigate based on role and action
        navigate(`/safety/${popupRole}/${action.toLowerCase()}`);
    };

    const closePopup = () => {
        setPopupRole(null);
    };

    const SafetyRolePopup = ({ role, onClose, onButtonClick }) => {
        // Get the correct qualifications based on the selected role
        const roleQualifications = qualifications[role] || qualifications.Engineer;

        return (
            <div className="popup-overlay" onClick={onClose}>
                <div className="qualifications-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-left">
                        <h2 className="qualifications-title">QUALIFICATIONS FOR REGISTRATION AS SAFETY {role.toUpperCase()}</h2>
                        <div className="qualifications-table">
                            <div className="table-header">
                                <div className="header-cell">Permanent Safety<br/>{role}</div>
                                <div className="header-cell">Temporary Safety<br/>{role}</div>
                            </div>
                            <div className="table-content">
                                <div className="content-cell">
                                    <ul>
                                        {roleQualifications.permanent.map((item, index) => (
                                            <li key={`permanent-${index}`} dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </ul>
                                </div>
                                <div className="content-cell">
                                    <ul>
                                        {roleQualifications.temporary.map((item, index) => (
                                            <li key={`temporary-${index}`} dangerouslySetInnerHTML={{ __html: item }} />
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-right">
                        <button className="close-button" onClick={onClose}>✖</button>
                        <div className="bureau-info">
                            <div className="bureau-logo"></div>
                            <div className="bureau-name">Mines and Geosciences Bureau - Region X</div>
                        </div>
                        <button 
                            onClick={() => onButtonClick('New')} 
                            className="apply-button"
                        >
                            APPLY NOW
                        </button>
                        <div className="existing-section">
                            <p>Already exist? Click here!</p>
                            <button 
                                onClick={() => onButtonClick('Existing')} 
                                className="tracking-button"
                            >
                                TRACK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="home-wrapper">
            <header className="main-header">
                <div className="header-content">
                    <div className="logo-section">
                        <span className="logo"></span>
                        <div className="header-text">
                            <h1>MGB</h1>
                            <p>Mines and Geosciences Bureau</p>
                            <p>
                                {isLoggedIn && ('kdog')}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <section className="intro-section">
                    <div className="intro-content">
                        <h2>Welcome to MGB</h2>
                        <p className="intro-description">
                            Safeguarding our natural heritage through sustainable management 
                            and environmental stewardship.
                        </p>
                        <div className="quote-box">
                            <p className="quote">
                            "Mining shall be pro-people and pro-environment in sustaining wealth creation and improved quality of life."
                            </p>
                        </div>
                    </div>
                </section>

                <section className="roles-section">
                    <div className="section-content">
                        <h2>Select Your Role</h2>
                        <div className="roles-container">
                            <button 
                                className="role-card"
                                onClick={() => handleRoleClick('Engineer')}
                            >
                                <div className="role-icon">🛠️</div>
                                <h3>Safety Engineer</h3>
                                <p>Access engineering tools and safety protocols</p>
                            </button>

                            <button 
                                className="role-card"
                                onClick={() => handleRoleClick('Inspector')}
                            >
                                <div className="role-icon">👷</div>
                                <h3>Safety Inspector</h3>
                                <p>Monitor and ensure compliance with safety standards</p>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Popup Modal */}
            {popupRole && (
                <SafetyRolePopup 
                    role={popupRole} 
                    onClose={closePopup} 
                    onButtonClick={handleButtonClick} 
                />
            )}

            <footer className="main-footer">
                <div className="footer-content">
                    <div className="footer-info">
                        <p>© 2025 Mines and Geosciences Bureau</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;