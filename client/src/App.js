import "./App.css";
import Navbar from "./Navbar";
import Features from "./components/Features";
import Footer from "./components/Footer";

function App() {

    return (
        <div className="App">
            <Navbar />
            <div className="center-content">
                <p className="tagline">Slouch <i>less</i>, do more.</p>
                <p className="tagline2">
                    Real-time slouching alerts to keep you productive and
                    pain-free.
                </p>
                <a className="start-button" href="/dashboard">
                    Start
                </a>
                <a href="#scrolldown" className="scroll-indicator">
                    ⌄
                </a>
            </div>
            <div id="scrolldown" className="scrolldown-content">
                <p>It all starts with your posture</p>
                <video
                    class="jw-video jw-reset"
                    tabindex="-1"
                    disableremoteplayback=""
                    webkit-playsinline=""
                    playsinline=""
                    src="blob:https://www.spine-health.com/c7ac31b9-f90b-4fba-bca8-11d4a53c33d7"
                ></video>
            </div>
            <Features />
            <Footer />
        </div>
    );
}

export default App;
