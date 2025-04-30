import axios from "axios";
import API_BASE_URL from "../../config";

const LOGIN_URL = `${API_BASE_URL}api/token/`
const REFRESH_URL = `${API_BASE_URL}api/token/refresh/`
const NOTES_URL = `${API_BASE_URL}api/notes/`


export const login = async (username, password) => {
    const response = await axios.post(LOGIN_URL,
        { username:username, password:password},  
        { withCredentials: true }
    );
    return response.data.success;
}

export const refresh_token = async () => {
    try {
        await axios.post(`${REFRESH_URL}`, {},{ withCredentials: true });
        return true;
    } catch (error) {
        return false;
    }

}

export const get_notes = async () => {
    try {
        const response = await axios.get(NOTES_URL,
            { withCredentials: true }
        );
        return response.data
    } catch (error) {
        console.log("Gets notes Error:", error)
        return call_refresh(error, () => axios.get(NOTES_URL, { withCredentials: true }));
    }
}

const call_refresh = async (error, func) => {
    if (error.response && error.response.status === 401) {
        const tokenRefresh = await refresh_token();
        if (tokenRefresh){
            const retryResponse = await func();
            return retryResponse.data
        }
    }
    return null;
}