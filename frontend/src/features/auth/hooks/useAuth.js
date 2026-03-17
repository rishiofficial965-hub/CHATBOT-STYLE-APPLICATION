import { useSelector, useDispatch } from "react-redux";
import {
  login,
  register,
  logout,
  getMe,
  verifyOTP,
  sendOTP,
  clearError
} from "../auth.slice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error, isInitialized } = useSelector((state) => state.auth);

  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    }
    return { success: false, error: result.payload };
  };

  const handleRegister = async (name, email, username, password) => {
    const result = await dispatch(register({ name, email, username, password }));
    if (register.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    }
    return { success: false, error: result.payload };
  };

  const handleLogout = () => dispatch(logout());

  const handleGetMe = () => dispatch(getMe());

  const handleVerifyOTP = async (otp) => {
    const result = await dispatch(verifyOTP(otp));
    if (verifyOTP.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    }
    return { success: false, error: result.payload };
  };

  const handleSendOTP = async () => {
    const result = await dispatch(sendOTP());
    if (sendOTP.fulfilled.match(result)) {
      return { success: true, data: result.payload };
    }
    return { success: false, error: result.payload };
  };

  const handleClearError = () => dispatch(clearError());

  return {
    user,
    loading,
    error,
    isInitialized,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGetMe,
    handleVerifyOTP,
    handleSendOTP,
    handleClearError
  };
};

export default useAuth;
