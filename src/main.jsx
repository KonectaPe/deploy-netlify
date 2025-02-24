import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { CssBaseline } from "@mui/material";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import { AuthProvider } from "./services/auth/AuthProvider.jsx";
import { PrivateRoute, PublicRoute } from "./routes/AppRoute.jsx";
import Participant from "./pages/participant/Participant.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Winner from "./pages/winner/Winner.jsx";
import Configuration from "./components/configuration/Configuration.jsx";
import EditParticipant from "./pages/participant/EditParticipant.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<App />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="participant" element={<Participant />} />
              <Route path="winner" element={<Winner />} />
              <Route path="configuration" element={<Configuration />} />
              <Route path="edit" element={<EditParticipant />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
