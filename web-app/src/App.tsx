import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HangoutsPage from "./pages/HangoutsPage";
import CreateHangoutPage from "./pages/CreateHangoutPage";
import HangoutDetailsPage from "./pages/HangoutDetailsPage";
import InvitePage from "./pages/InvitePage";
import "./App.css";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("accessToken");

  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/hangouts"
        element={
          <RequireAuth>
            <HangoutsPage />
          </RequireAuth>
        }
      />

      <Route
        path="/hangouts/new"
        element={
          <RequireAuth>
            <CreateHangoutPage />
          </RequireAuth>
        }
      />

      <Route
        path="/hangouts/:id"
        element={
          <RequireAuth>
            <HangoutDetailsPage />
          </RequireAuth>
        }
      />

      <Route path="/invite/:inviteCode" element={<InvitePage />} />
    </Routes>
  );
}
