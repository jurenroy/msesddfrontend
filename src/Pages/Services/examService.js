import axios from 'axios';
import API_BASE_URL from "../../config";

const ExamList_URL = `${API_BASE_URL}api/exam/`
const ExamQuestion_URL = `${API_BASE_URL}api/exam/`
const ExamValidate_URL = `${API_BASE_URL}api/exam/validate/`
const ExamResults_URL = `${API_BASE_URL}api/exam/results/`

export const fetchExamList = async () => {
  try {
    const response = await axios.get(ExamList_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching exam list:', error);
    throw error;
  }
};

export const fetchExamQuestions = async (examId) => {
  try {
    const response = await axios.get(`${ExamQuestion_URL}${examId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    throw error;
  }
};

export const ExamResults = async () => {
  const response = await axios.get(ExamResults_URL);
  return response.data;
};

export const ValidateExamAnswers = async (submissionData) => {
  try {
    console.log("Sending data to validate:", submissionData)
    const response = await axios.post(ExamValidate_URL, submissionData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error kay mali:", error);
    throw error;
  }
};

