import React, { useEffect, useRef, useState } from "react";

const Settings = ({ setIsOpen }) => {
    const [allowNotifications, setAllowNotifications] = useState(false);
    const [buzzerSound, setBuzzerSound] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("English");

    // Ref to the modal container
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsOpen(false); // Close the modal
            }
        };

        // Add event listener when component mounts
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up the event listener when component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsOpen]);

    return (
        <div
            className="settings-container"
            ref={modalRef} // Attach the ref to the container
            style={{
                backgroundColor: "white",
                borderRadius: "50px",
                padding: "24px",
                width: "270px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                }}
            >
                <h2
                    style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#828282",
                        fontSize: "24px",
                        gap: "8px",
                        margin: 0,
                    }}
                >
                    <img width="24px" src="Vector.svg" alt="" />
                    Settings
                </h2>
                <button
                    style={{
                        border: "none",
                        background: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                        color: "#828282",
                    }}
                    onClick={() => setIsOpen(false)}
                >
                    ×
                </button>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>Allow Notifications</span>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={allowNotifications}
                            onChange={() =>
                                setAllowNotifications(!allowNotifications)
                            }
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>Buzzer Sound</span>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={buzzerSound}
                            onChange={() => setBuzzerSound(!buzzerSound)}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>Dark Mode</span>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span>Language</span>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{
                            padding: "8px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f0f0f0",
                        }}
                    >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Settings;
