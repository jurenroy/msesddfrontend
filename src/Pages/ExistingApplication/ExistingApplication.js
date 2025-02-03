import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ExistingApplication.css'; // Import the CSS file for styling
import API_BASE_URL from '../../config';

const ExistingApplication = () => {
    const { role } = useParams();
    const navigate = useNavigate();
    const [trackingNumber, setTrackingNumber] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setTrackingNumber(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setData(null);

        try {
            const response = await fetch(`${API_BASE_URL}api/safety/${trackingNumber}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            setData(jsonData);
            console.log(jsonData)
            if (role === jsonData.role) {
            navigate(`/safety/${jsonData.role}/existing/${jsonData.tracking_code}`); // Navigate to the new route
            }
        } catch (err) {
            setError('Failed to fetch data. Please check the tracking number.');
        }
    };

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <div className="existing-tracking-form">
            <h1>{role === 'Engineer' ? 'Safety Engineer' : 'Safety Inspector'} - Existing Application</h1>
            <form onSubmit={handleSubmit}>
                <div className="existing-tracking-input-container">
                    <input
                        type="text"
                        className="existing-tracking-input"
                        value={trackingNumber}
                        onChange={handleInputChange}
                        placeholder="Enter Tracking Number"
                    />
                </div>
                {error && <div className="existing-tracking-error">{error}</div>}
                <div className="existing-tracking-button-container">
                    <button type="submit" className="existing-tracking-button">Track</button>
                    <button type="button" className="existing-tracking-back-button" onClick={handleBack}>Back</button>
                </div>
            </form>
            {data && (
                <div>
                    <h2>Tracking Information</h2>
                    <p>Tracking Number: {data.tracking_code}</p>
                    <p>Invalid Role it should be {data.role}</p>
                </div>
            )}
        </div>
    );
};

export default ExistingApplication;