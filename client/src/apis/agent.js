import axios from "axios";

export const getLogs = async (count) => {
    try {
        // Pass count as a query parameter
        const response = await axios.get(`http://localhost:3050/logs?count=${count}`);
        return response; // Return the response object
    } catch (error) {
        console.error("Error in getLogs:", error);
        throw error; // Throw the error to handle it in the calling code
    }
};
