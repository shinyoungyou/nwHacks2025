import React from "react";
import "../App.css";

function Features() {
    const features = [
        {
            title: "Accelerometers detect movement",
            description:
                "User input is collected via MLH accelerometers strapped onto one's head, shoulders, or chest.",
            image: "undraw_in-the-zone_07y7 1.png", // Replace with the actual image URL or import
        },
        {
            title: "Start your session",
            description:
                "Customize your settings. Set a timer or start a free-form session to stay on task pain-free.",
            image: "Group 67.png", // Replace with the actual image URL or import
        },
        {
            title: "Get notified, stay productive",
            description:
                "Create notifications to maintain good posture and focus throughout the day.",
            image: "Group 75.png", // Replace with the actual image URL or import
        },
    ];

    return (
        <div className="features-section">
            <h2 className="section-title">How slouchii works</h2>
            <div className="features-container">
                {features.map((feature, index) => (
                    <div className="feature-card" key={index}>
                        <img
                            className="feature-image"
                            src={process.env.PUBLIC_URL+feature.image}
                            alt={feature.title}
                        />
                        <h3 className="feature-title">{feature.title}</h3>
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
