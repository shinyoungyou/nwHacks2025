import React from "react";

const Footer = () => {
    return (
        <footer
            style={{
                boxSizing: "border-box",
                paddingBottom: "40px",
                paddingLeft: "20px",
                paddingRight: "3rem",
                paddingTop: "50px",
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
                <span>Gunyup Chun</span>
                <span>Sunny Weng</span>
                <span>Donggyu Kim</span>
                <span>Shinyoung You</span>
            </div>
        </footer>
    );
};

export default Footer;
