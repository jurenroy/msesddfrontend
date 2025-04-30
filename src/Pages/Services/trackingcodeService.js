import axios from 'axios';
import API_BASE_URL from '../../config';

// Original function to validate tracking code
export const getByTrackingCode = async (trackingcode) => {
    try {
        const url = `${API_BASE_URL}/api/safety/${trackingcode}`;
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_TOKEN' 
            }
        });
        return response.data; 
    } catch (error) {
        return { error: true, message: 'Tracking Code does not exist.' }; 
    }
};


export const checkExamResults = async (trackingcode) => {
    try {
        const url = `${API_BASE_URL}/api/exam-results/${trackingcode}`;
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_TOKEN' 
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        throw error;
    }
};

