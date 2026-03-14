import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginForm from "./features/auth/pages/LoginForm";
import RegistrationForm from "./features/auth/pages/RegistrationForm";
import VerifyOTP from "./features/auth/pages/VerifyOTP";
import Home from "./features/auth/pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegistrationForm />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOTP />,
  },
  {
    path: "/home",
    element: <Home />,
  },
]);
