import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../Navbar";
import { getLogs } from "../apis/agent";

const TimerContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 85vh;
    background-color: #fff;
`;

const CircularProgress = styled.div`
    width: 491px;
    height: 491px;
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
        width: 471px;
        height: 471px;
        border-radius: 50%;
        background: white;
    }
`;

// ... rest of the component code remains the same ...

// const TimeWrapper = styled.div`
//     position: relative;
//     z-index: 1;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     gap: 10px;
// `;

const TimeDisplay = styled.div`
    font-size: 125px;
    font-weight: 400;
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

const TimerLine = styled.div`
    width: 325px;
    height: 3px;
    background-color: #e5e7eb;
    margin: 0 0 20px 0;
`;

const Button = styled.button`
    background-color: #6366f1;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 12px 40px;
    font-size: 24px;
    width: 325px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #4f46e5;
    }
`;

// Add new styled components for the labels
const LabelContainer = styled.div`
  display: flex;
  gap: 61px;
  margin-bottom: 10px;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${props => props.active ? '#000' : '#888'};
  font-size: 24px;
`;

// Update the IconsContainer to remove it since we'll use the new label system
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

const ButtonContainer = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 20px;
`;

const SecondaryButton = styled(Button)`
    background-color: #e5e7eb;
    color: #374151;

    &:hover {
        background-color: #d1d5db;
    }
`;

const Timer = () => {
    const [count, setCount] = useState(0); // Default count to 0
    const [origin, setOrigin] = useState("");
    const [logs, setLogs] = useState("");

    const [timeInSeconds, setTimeInSeconds] = useState(15 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [minutes, setMinutes] = useState(15);
    const [seconds, setSeconds] = useState(0);
     const [hasStarted, setHasStarted] = useState(false);
    const initialTime = 15 * 60;
    const location = useLocation();
    const data = location.state?.calibrationData;

    useEffect(()=> {
        console.log(data);
        setOrigin(data);
    }, [])

     useEffect(() => {
     let notificationInterval;

        const requestAndShowNotification = async () => {
            // Request permission only if not already granted
            if (Notification.permission === "default") {
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    return;
                }
            }

            // Only show notification if permission is granted
            if (Notification.permission === "granted" && isRunning) {
                new Notification("Timer Alert", {
                    body: "This is your 5-second notification!",
                    icon: "/Timer.svg", // Optional: add your timer icon
                });
            }
        };

     if (isRunning) {
         // Initial notification request
         requestAndShowNotification();

         // Set up interval for subsequent notifications
         notificationInterval = setInterval(requestAndShowNotification, 5000);
     }

     return () => {
         if (notificationInterval) {
             clearInterval(notificationInterval);
         }
     };
 }, [isRunning]);


    useEffect(() => {
        setCount(3); // Sets count to 3 on component mount
    }, []);

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
        if (!isRunning) {
            setHasStarted(true);
        }
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

    const handleClick = async () => {
        try {
            const response = await getLogs(count); // Await the result of getLogs
            console.log("Logs received:", response); // Logs the response data
            setLogs(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const handleRestart = () => {
        setTimeInSeconds(initialTime);
        setIsRunning(true);
    };

    const handleThreshold = () => {
        let xCrossed = origin.x - 0.3 > logs.x;
        let zCrossed = origin.z + 0.3 < logs.z;
    }

    return (
        <>
            <Navbar timer={true} />
            <TimerContainer>
                {hasStarted ? (
                    <>
                        <CircularProgress progress={1 - progress}>
                            <TimeWrapper>
                                <IconsContainer>
                                    <span>
                                        <img
                                            width="28px"
                                            src="Timer.svg"
                                            alt=""
                                        />
                                    </span>
                                    <span>
                                        <img
                                            width="36px"
                                            src="Frame 32.svg"
                                            alt=""
                                        />
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
                        <ButtonContainer>
                            <SecondaryButton onClick={handleStartPause}>
                                Pause
                            </SecondaryButton>
                            <SecondaryButton onClick={handleRestart}>
                                Restart
                            </SecondaryButton>
                        </ButtonContainer>
                    </>
                ) : (
                    <>
                        <TimeWrapper>
                            <LabelContainer>
                                <Label active={true}>
                                    <img width="20px" src="Timer.svg" alt="" />
                                    Timer
                                </Label>
                                <Label active={false}>
                                    <img
                                        width="28px"
                                        src="Frame 32.svg"
                                        alt=""
                                    />
                                    Unlimited
                                </Label>
                            </LabelContainer>
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
                        <TimerLine />
                        <Button
                            onClick={() => {
                                handleStartPause();
                                handleClick();
                            }}
                        >
                            {isRunning ? "Pause" : "Start"}
                        </Button>
                    </>
                )}
            </TimerContainer>
        </>
    );
};
// resume, restart
export default Timer;
