import "./App.css";
import { useState, useEffect } from "react";
import { getLogs } from "./apis/agent";

function App() {
    const [count, setCount] = useState(0); // Default count to 0
    const [logs, setLogs] = useState("");

    useEffect(() => {
        setCount(3); // Sets count to 3 on component mount
    }, []);

    const handleClick = async () => {
        try {
            const response = await getLogs(count); // Await the result of getLogs
            console.log("Logs received:", response); // Logs the response data
            setLogs(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    return (
        <div className="App">
            <p>
                This is App
            </p>
            <button onClick={handleClick}>Get Logs</button>
            <p>Count: {count}</p>
            <p>{logs}</p>
        </div>
    );
}

export default App;
