import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";

export const routes = [
    { path: "/", element: <App />},
    { path: "dashboard", element: <Dashboard /> },
    { path: "settings", element: <Settings /> },
];

export const router = createBrowserRouter(routes);
