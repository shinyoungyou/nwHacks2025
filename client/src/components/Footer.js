import React from "react";

const Footer = () => {
    return (
        <footer
            style={{
                boxSizing: "border-box",
                paddingBottom: "40px",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "120px",
                width: "100%",
                textAlign: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    color: "#828282",
                    fontSize: "20px",
                }}
            >
                <div
                    style={{
                        fontSize: "30px",
                        color: "#828282",
                        paddingBottom: "5rem",
                    }}
                >
                    nwhacks 2025 project
                </div>
                <span>Gunyup Chun</span>
                <span>Sunny Weng</span>
                <span>Donggyu Kim</span>
                <span>Shinyoung You</span>
            </div>
        </footer>
    );
};

export default Footer;
