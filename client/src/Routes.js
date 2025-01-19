import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import Timer from "./components/Timer";

export const routes = [
    { path: "/", element: <App /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "settings", element: <Settings /> },
    { path: "timer", element: <Timer /> },
];

export const router = createBrowserRouter(routes);
