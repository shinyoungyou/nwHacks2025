import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "../Navbar";

const TimerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 85vh;
    background-color: #fff;
`;

const CircularProgress = styled.div`
    width: 300px;
    height: 300px;
    border-radius: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: conic-gradient(
        from 0deg,
        #e5e7eb ${(props) => props.progress * 360}deg,
        #6366f1 ${(props) => props.progress * 360}deg 360deg
    );
    margin-bottom: 20px;

    &::before {
        content: "";
        position: absolute;
        width: 280px;
        height: 280px;
        border-radius: 50%;
        background: white;
    }
`;

// ... rest of the component code remains the same ...

const TimeWrapper = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
`;

const IconsContainer = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 10px;
    font-size: 20px;
`;

const TimeDisplay = styled.div`
    font-size: 72px;
    font-weight: 500;
    color: #333;
    cursor: pointer;
`;

const TimeInput = styled.input`
    font-size: 72px;
    width: 100px;
    border: none;
    outline: none;
    background: transparent;
    text-align: center;
`;

const Button = styled.button`
    background-color: #6366f1;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 12px 40px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #4f46e5;
    }
`;

const Timer = () => {
    const [timeInSeconds, setTimeInSeconds] = useState(15 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [minutes, setMinutes] = useState(15);
    const [seconds, setSeconds] = useState(0);
    const initialTime = 15 * 60;

    useEffect(() => {
        let interval;
        if (isRunning && timeInSeconds > 0) {
            interval = setInterval(() => {
                setTimeInSeconds((prev) => prev - 1);
            }, 1000);
        } else if (timeInSeconds === 0) {
            setIsRunning(false);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeInSeconds]);

    useEffect(() => {
        setMinutes(Math.floor(timeInSeconds / 60));
        setSeconds(timeInSeconds % 60);
    }, [timeInSeconds]);

    const progress = timeInSeconds / initialTime;

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleTimeEdit = () => {
        if (!isRunning) {
            setIsEditing(true);
        }
    };

    const handleMinutesChange = (e) => {
        const value = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 99);
        setMinutes(value);
        setTimeInSeconds(value * 60 + seconds);
    };

    const handleSecondsChange = (e) => {
        const value = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 59);
        setSeconds(value);
        setTimeInSeconds(minutes * 60 + value);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    return (
        <>
            <Navbar timer={true} />
            <TimerContainer>
                <CircularProgress progress={1 - progress}>
                    <TimeWrapper>
                        <IconsContainer>
                            <span>
                                <img width="28px" src="Timer.svg" alt="" />
                            </span>
                            <span>
                                <img width="36px" src="Frame 32.svg" alt="" />
                            </span>
                        </IconsContainer>
                        <TimeDisplay onClick={handleTimeEdit}>
                            {isEditing ? (
                                <>
                                    <TimeInput
                                        type="number"
                                        value={minutes}
                                        onChange={handleMinutesChange}
                                        onBlur={handleBlur}
                                        autoFocus
                                    />
                                    :
                                    <TimeInput
                                        type="number"
                                        value={seconds
                                            .toString()
                                            .padStart(2, "0")}
                                        onChange={handleSecondsChange}
                                        onBlur={handleBlur}
                                    />
                                </>
                            ) : (
                                `${minutes
                                    .toString()
                                    .padStart(2, "0")}:${seconds
                                    .toString()
                                    .padStart(2, "0")}`
                            )}
                        </TimeDisplay>
                    </TimeWrapper>
                </CircularProgress>
                <Button onClick={handleStartPause}>
                    {isRunning ? "Pause" : "Start"} 
                </Button>
            </TimerContainer>
        </>
    );
};
// resume, restart
export default Timer;
