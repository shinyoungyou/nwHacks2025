// Progress.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ProgressBar = styled.div`
    width: 100%;
    height: 10px;
    background-color: #e0e0e0;
    border-radius: 5px;
    overflow: hidden;
    margin-top: 20px;
`;

const Progresso = styled.div`
    height: 100%;
    background-color: #6366f1;
    width: ${(props) => props.progress}%;
    transition: width 0.1s linear;
`;

function Progress({ onComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const duration = 10000; // 10 seconds

        const timer = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const newProgress = Math.min((elapsedTime / duration) * 100, 100);

            setProgress(newProgress);

            if (elapsedTime >= duration) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, 16); // Update roughly every frame for smooth animation

        return () => clearInterval(timer);
    }, []); // Empty dependency array means this runs once when component mounts

    return (
        <ProgressBar>
            <Progresso progress={progress} />
        </ProgressBar>
    );
}

export default Progress;
