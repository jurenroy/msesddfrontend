import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TrackingDocument = () => {
    const { role, trackingcode } = useParams();
    const [trackingData, setTrackingData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrackingData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/safety/${trackingcode}`);
                setTrackingData(response.data); // Assuming the response data is in the expected format
                setError(null); // Clear any previous errors
            } catch (err) {
                setError('Error fetching tracking data.'); // Handle error
                console.error(err); // Log the error for debugging
            }
        };

        fetchTrackingData();
    }, [trackingcode]); // Dependency array to refetch if trackingcode changes

    return (
        <div>
            <h1>Tracking Document</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {trackingData && trackingData.role === role ? (
                <div>
                    <h2>Tracking Information</h2>
                    <p>Role: {role}</p>
                    <p>Tracking Code: {trackingcode}</p>
                    {/* Render other tracking data as needed */}
                    <pre>{JSON.stringify(trackingData, null, 2)}</pre> {/* Display the fetched data */}
                </div>
            ) : (
                <p>Tracked Document not Found</p>
            )}
        </div>
    );
};

export default TrackingDocument;