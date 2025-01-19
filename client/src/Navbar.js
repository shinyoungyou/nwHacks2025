import React, { useState } from "react";
import "./App.css";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <a href="/">slouch<span id="highlight">ii</span></a>
            </div>
        </nav>
    );
};

export default Navbar;
