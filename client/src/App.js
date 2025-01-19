import "./App.css";
import Navbar from "./Navbar";
import Features from "./components/Features";
import Footer from "./components/Footer";

function App() {

    return (
        <div>
            <Navbar timer={false} main={true} />
            <div className="center-content">
                <p className="tagline">
                    Slouch <i>less</i>, do more.
                </p>
                <p className="tagline2">
                    Real-time slouching alerts to keep <br />
                    you productive and pain-free.
                </p>
                <a className="start-button" href="/dashboard">
                    Start
                </a>
                <a href="#scrolldown" className="scroll-indicator">
                    <img src="arrow.png" alt="" />
                </a>
            </div>
            <div id="scrolldown" className="scrolldown-content">
                <img width="1000px" src="screen2 1.svg" alt="" />
            </div>
            <Features />
            <Footer />
        </div>
    );
}

export default App;
