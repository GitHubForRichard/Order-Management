import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import HomePage from "pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

import "./App.css";
import { Notifications } from "./components/Notifications";
import LeavePage from "./pages/LeavePage/LeavePage";
import UserPage from "./pages/UserPage/UserPage";
import NavBar from "./NavBar";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import LeaveCalendarPage from "./pages/LeaveCalendarPage/LeaveCalendarPage";
import LeaveSummary from "./pages/LeavePage/LeaveSummary";
import { RemainingHoursSummary } from "./pages/LeavePage/RemainingHoursSummary";

// Protected Route Component
const PrivateRoute = ({ children }: { children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Notifications />
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaves"
            element={
              <PrivateRoute>
                <LeavePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaves/calendar"
            element={
              <PrivateRoute>
                <LeaveCalendarPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaves/summary"
            element={
              <PrivateRoute>
                <LeaveSummary />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UserPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaves/remaining-hours/summary"
            element={
              <PrivateRoute>
                <RemainingHoursSummary />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
