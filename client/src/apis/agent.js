import axios from "axios";

export const getLogs = async (count) => {
    try {
        const response = await axios.get("logs", count);
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
    }
};