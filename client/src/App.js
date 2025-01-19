import "./App.css";
import { useState, useEffect } from "react";
import { getLogs } from "./apis/agent";

function App() {
    const [count, setCount] = useState(0); // Default count to 0

    useEffect(() => {
        setCount(3); // Sets count to 3 on component mount
    }, []);

    const handleClick = async () => {
        try {
            const logs = await getLogs(count); // Await the result of getLogs
            console.log("Logs received:", logs.data); // Logs the response data
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
        </div>
    );
}

export default App;
