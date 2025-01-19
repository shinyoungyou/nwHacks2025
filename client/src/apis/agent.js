import axios from "axios";

export const getLogs = async (num_logs) => {
    try {
        // Pass count as a query parameter
        const response = await axios.get(`http://localhost:3050/logs?num_logs=${num_logs}`);
        return response; // Return the response object
    } catch (error) {
        console.error("Error in getLogs:", error);
        throw error; // Throw the error to handle it in the calling code
    }
};

export const postCalibrate = async () => {
    try {
        // Pass count as a query parameter
        const response = await axios.post(`http://localhost:3050/calibrate`);
        return response; // Return the response object
    } catch (error) {
        console.error("Error in getLogs:", error);
        throw error; // Throw the error to handle it in the calling code
    }
};

export const postSettings = async (toggleBuzzeron) => {
    try {
        // Pass count as a query parameter
        const response = await axios.post(`http://localhost:3050/settings?buzzer_on=${toggleBuzzeron ? "1" : "0"}`);
        return response; // Return the response object
    } catch (error) {
        console.error("Error in getLogs:", error);
        throw error; // Throw the error to handle it in the calling code
    }
};