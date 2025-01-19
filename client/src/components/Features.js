import React from "react";
import "../App.css";

function Features() {
    const features = [
        {
            description: "Step 1: Equip your slouchii",
            image: "undraw_podcast-listener_dpel 1.png", // Replace with the actual image URL or import
        },
        {
            description: "Step 2: shoulders back",
            image: "Group 69.png", // Replace with the actual image URL or import
        },
        {
            description: "Step 3: Chin tucked in ",
            image: "undraw_programmer_raqr (2) 1.png", // Replace with the actual image URL or import
        },
        {
            description: "Step 4: Stretch regularly",
            image: "undraw_yoga_yy99 1.png", // Replace with the actual image URL or import
        },
    ];

    return (
        <div className="features-section">
            <h2 className="section-title">
                Let’s fix your posture <br /> one <i>buzz</i> at a time
            </h2>
            <p className="section-desc">
                A posture correcting app that lets you dive straight <br /> into
                your workflow & a healthier tomorrow.{" "}
            </p>
            <div className="features-container">
                {features.map((feature, index) => (
                    <div className="feature-card" key={index}>
                        <img
                            className="feature-image"
                            src={process.env.PUBLIC_URL + feature.image}
                            alt={feature.title}
                        />
                        <p className="feature-description">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Features;
