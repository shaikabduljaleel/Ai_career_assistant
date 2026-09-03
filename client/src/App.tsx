import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerification from "./pages/ResendVerification";
import VerifyOtp from "./pages/VerifyOtp";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Documents from "./pages/Documents";
import CareerIntelligence from "./pages/CareerIntelligence";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
  path="/register"
  element={<Register />}
/>
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/resend-verification"
  element={<ResendVerification />}
/>
        <Route
  path="/verify-otp"
  element={<VerifyOtp />}
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
<Route
  path="/chat"
  element={
  <ProtectedRoute>
    <Chat />
  </ProtectedRoute>
  
  }
/>
        <Route
  path="/documents"
  element={
    <ProtectedRoute>
      <Documents />
    </ProtectedRoute>
  }
/>
<Route
  path="/career-intelligence"
  element={
    <ProtectedRoute>
      <CareerIntelligence />
    </ProtectedRoute>
  }
/>
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;