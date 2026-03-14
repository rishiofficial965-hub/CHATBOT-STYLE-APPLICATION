import {  useState, useEffect } from "react";
import { AuthContext } from "./AuthContext"; 
import { getMe, login, register, updateProfile, verifyOTP, sendOTP } from "../services/auth.api";


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleGetMe();
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  const handleLogin = async (credentials) => {
  setLoading(true);
  try {
    const data = await login(credentials);
    setUser(data);
    return { success: true, data: data };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || "Invalid username or password"
    };
  } finally {
    setLoading(false);
  }
};

  const handleRegister = async (name, email, username, password) => {
    setLoading(true);
    try {
      const data = await register(name, email, username, password);
      setUser(data);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = async () => {
    setLoading(true);
  try {
    const data = await getMe();
    setUser(data);
    return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setLoading(true);
    try {
      const data = await verifyOTP(otp);
      // Backend might return updated user status after verification
      if (data.user) setUser(data.user);
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Invalid or expired OTP"
      };
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const data = await sendOTP();
      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error resending OTP"
      };
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (profileData) => {
    setLoading(true);
    try {
      const updatedUser = await updateProfile(profileData);
      setUser(prev => ({ ...prev, ...updatedUser }));
      return { success: true, data: updatedUser };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Error updating profile"
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        handleLogin,
        handleRegister,
        handleVerifyOTP,
        handleSendOTP,
        handleGetMe,
        handleUpdateProfile,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
