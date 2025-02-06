import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleRoleClick = (role) => {
        navigate(`/safety/${role}`);
    };

    return (
        <div className="home-wrapper">
            {}
            <header className="main-header">
                <div className="header-content">
                    <div className="logo-section">
                        <span className="logo"></span>
                        <div className="header-text">
                            <h1>MGB</h1>
                            <p>Mines and Geosciences Bureau</p>
                        </div>
                    </div>
                </div>
            </header>

            {}
            <main>
                {}
                <section className="intro-section">
                    <div className="intro-content">
                        <h2>Welcome to MGB</h2>
                        <p className="intro-description">
                            Safeguarding our natural heritage through sustainable management 
                            and environmental stewardship.
                        </p>
                        <div className="quote-box">
                            <p className="quote">
                            “Mining shall be pro-people and pro-environment in sustaining wealth creation and improved quality of life.”
                            </p>
                        </div>
                    </div>
                </section>

                {}
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

            {}
            <footer className="main-footer">
                <div className="footer-content">
                    <div className="footer-info">
                        <p>© 2025 Mines and Geosciences Bureau</p>
                        <p>Republic of the Philippines</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;