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
// IJYY7FmQ2bsT2hZcvZQ0Ga_x93tsuOQyiUy6XpUlasT4ZXcwNBygejeo4gGm8-jO43sh_smlHOjG0C6MifRx3Q==