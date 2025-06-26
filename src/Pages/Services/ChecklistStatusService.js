import axios from 'axios';
import API_BASE_URL from "../../config";

const ChecklistStatus_URL = `${API_BASE_URL}api/checklist-statuses/`;

export const fetchChecklistStatus = async () => {
  try {
    const response = await axios.get(ChecklistStatus_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching exam list:', error);
    throw error;
  }
};

export const approveApplication = async (trackingCode, orNumber) => {
  try {
    // Make sure trackingCode is a string and properly formatted
    if (!trackingCode || typeof trackingCode !== 'string') {
      throw new Error('Invalid tracking code provided');
    }
    
    console.log(`Approving application with tracking code: ${trackingCode}`);
    
    const response = await axios.post(
      `${API_BASE_URL}api/checklist/${trackingCode}/status/`,
      { status: 'approved', or_no: orNumber}
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in approveApplication:', error);
    throw error;
  }
};

export const StatusbyTrackingCode = async (trackingCode) => {
  try {
    if (!trackingCode || typeof trackingCode !== 'string') {
      throw new Error('Invalid tracking code provided');
    }
    
    console.log(`Fetching status for tracking code: ${trackingCode}`);
    
    const response = await axios.get(
      `${API_BASE_URL}api/checklist/${trackingCode}/status_history/`
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in StatusbyTrackingCode:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Fetch checklist details by tracking code
export const fetchChecklistDetails = async (trackingCode) => {
  try {
    if (!trackingCode || typeof trackingCode !== 'string') {
      throw new Error('Invalid tracking code provided');
    }
    
    console.log(`Fetching checklist details for tracking code: ${trackingCode}`);
    
    const response = await axios.get(
      `${API_BASE_URL}api/checklist/${trackingCode}/`
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error in fetchChecklistDetails:', error);
    return {
      success: false,
      error: error.message
    };
  }
};