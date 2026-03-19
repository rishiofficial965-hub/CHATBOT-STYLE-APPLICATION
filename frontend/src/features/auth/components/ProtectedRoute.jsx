import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { user, isInitialized } = useSelector((state) => state.auth);

  // Wait until getMe has completed before deciding to redirect
  if (!isInitialized) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
