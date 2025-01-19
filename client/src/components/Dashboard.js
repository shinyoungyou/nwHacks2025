// LoadingScreen.jsx
import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../Navbar";
import Progress from "./Progress";
import { postCalibrate } from "../apis/agent";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
    background-color: white;
    font-family: Arial, sans-serif;
`;

const Content = styled.div`
    text-align: center;
    position: relative;
    max-width: 600px;
    width: 100%;
    padding: 0 20px;
`;

const LoadingText = styled.h2`
    font-size: 24px;
    color: #333;
    margin-bottom: 40px;
`;

const SlideContainer = styled.div`
    position: relative;
    margin: 40px 0;
`;

const NavigationButton = styled.a`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    ${(props) =>
        props.direction === "left" ? "left: -40px;" : "right: -40px;"}
    cursor: pointer;

    svg {
        transition: stroke 0.2s ease;
        &:hover path {
            stroke: #333;
        }
    }
`;

const DotsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 40px;
`;

const Dot = styled.div`
    width: 8px;
    height: 8px;
    background-color: ${(props) => (props.active ? "#333" : "#828282")};
    border-radius: 50%;
    transition: background-color 0.2s ease;
`;

const IllustrationImage = styled.img`
    width: ${(props) => props.width};
    height: auto;
    margin: 0 auto;
    display: block;
`;

function Dashboard() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleClick = async () => {
        try {
            const response = await postCalibrate(); // Await the result of getLogs
            console.log("Logs received:", response); // Logs the response data
            // setLogs(response.data);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const slides = [
        {
            left: false,
            right: true,
            width: "300px",
            text: "Put on your gear...",
            image: "undraw_in-the-zone_07y7 1.svg",
            showButton: false,
            showProgress: false,
            showFinishButton: false,
        },
        {
            left: true,
            right: false,
            width: "247px",
            text: "Maintain good posture for calibration...",
            image: "undraw_designer-girl_jtyy 1.svg",
            showButton: true,
            showProgress: false,
            showFinishButton: false,
        },
        {
            left: false,
            right: false,
            width: "325px",
            text: "Please remain still while calibrating...",
            image: "undraw_speed-test_wdyh 1.svg",
            showButton: false,
            showProgress: true,
            showFinishButton: false,
        },
        {
            left: false,
            right: false,
            width: "337px",
            text: "Hurray! You are ready to start your journey to better posture!",
            image: "undraw_adventure-map_8hg8 1.svg",
            showButton: false,
            showProgress: false,
            showFinishButton: true,
        },
    ];

    return (
        <>
            <Navbar timer={false} />
            <Container>
                <Content>
                    <LoadingText>{slides[currentSlide].text}</LoadingText>
                    <SlideContainer>
                        {currentSlide > 0 && slides[currentSlide].left && (
                            <NavigationButton
                                direction="left"
                                onClick={() =>
                                    setCurrentSlide((prev) => prev - 1)
                                }
                            >
                                <svg
                                    width="24"
                                    height="25"
                                    viewBox="0 0 24 25"
                                    fill="none"
                                >
                                    <path
                                        d="M15 19.5L8 12.5L15 5.5"
                                        stroke="#828282"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </NavigationButton>
                        )}
                        <IllustrationImage
                            width={slides[currentSlide].width}
                            src={slides[currentSlide].image}
                            alt=""
                        />
                        {currentSlide < slides.length - 1 &&
                            slides[currentSlide].right && (
                                <NavigationButton
                                    direction="right"
                                    onClick={() =>
                                        setCurrentSlide((prev) => prev + 1)
                                    }
                                >
                                    <svg
                                        width="24"
                                        height="25"
                                        viewBox="0 0 24 25"
                                        fill="none"
                                    >
                                        <path
                                            d="M9 5.5L16 12.5L9 19.5"
                                            stroke="#828282"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </NavigationButton>
                            )}
                    </SlideContainer>

                    {slides[currentSlide].showButton && (
                        <button
                            className="start-button"
                            onClick={()=>setCurrentSlide((prev) => prev + 1)}
                        >
                            Start Calibration
                        </button>
                    )}
                    {slides[currentSlide].showProgress && (
                        <Progress
                            onComplete={() => {
                                // Handle completion
                                console.log("Calibration complete");
                                // Navigate or update state as needed
                                setCurrentSlide((prev) => prev + 1);
                            }}
                        />
                    )}
                    {slides[currentSlide].showFinishButton && (
                        <a onClick={handleClick} className="start-button" href="/timer">
                            Finish Calibration
                        </a>
                    )}

                    <DotsContainer>
                        {slides.map((_, index) => (
                            <Dot
                                key={index}
                                active={currentSlide === index}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </DotsContainer>
                </Content>
            </Container>
        </>
    );
}

export default Dashboard;
