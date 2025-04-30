import axios from "axios";
import API_BASE_URL from "../../config";

const UserData_URL = `${API_BASE_URL}/api/safety/`;

export const fetchUserData = async () => {
    const response = await axios.get(UserData_URL);
    return response.data;
  };