import React, { useState } from "react";
import "./App.css";
import Settings from "./components/Settings";

const Navbar = ({ timer, main }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSettings = () => {
        setIsOpen((prev) => !prev); // Toggles the state
    };

    return (
        <nav className="navbar" style={main && {backgroundColor: "#FAF9FF"} }>
            <div className="navbar-brand">
                <a href="/">
                    slouch<span id="highlight">ii</span>
                </a>
            </div>
            {main && (
                <a
                    className="start-button"
                    style={{ fontSize: "20px" }}
                    href="/dashboard"
                >
                    Start
                </a>
            )}
            {timer && (
                <div style={{ cursor: "pointer" }} onClick={toggleSettings}>
                    {" "}
                    {/* Correctly using the function */}
                    <img src="Vector2.svg" alt="Settings" />
                </div>
            )}
            {isOpen && (
                <div className="settings-navbar">
                    <Settings setIsOpen={setIsOpen} />
                </div>
            )}
        </nav>
    );
};

export default Navbar;
