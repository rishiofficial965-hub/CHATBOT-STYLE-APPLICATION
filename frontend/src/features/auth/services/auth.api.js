import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

axios.defaults.withCredentials = true;

export async function register(name, email, username, password) {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      username,
      password,
    });
    return response.data.data.user;
  } catch (err) {
    throw err;
  }
}

export async function login({ email, username, password }) {
  try {
    const response = await api.post("/auth/login", {
      email,
      username,
      password,
    });
    return response.data.data.user;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
}

export async function getMe() {
  try {
    const response = await api.get("/auth/get-me");
    return response.data.data.user;
  } catch (err) {
    console.error("GetMe error:", err);
    throw err;
  }
}

export async function verifyOTP(otp) {
  try {
    const response = await api.post("/auth/verify-otp", { otp });
    return response.data;
  } catch (err) {
    console.error("Verify OTP error:", err);
    throw err;
  }
}

export async function sendOTP() {
  try {
    const response = await api.get("/auth/send-otp");
    return response.data;
  } catch (err) {
    console.error("Send OTP error:", err);
    throw err;
  }
}

export async function updateProfile(profileData) {
  try {
    const isFormData = profileData instanceof FormData;
    const response = await api.patch("/users/profile", profileData, {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
    });
    return response.data.user;
  } catch (err) {
    console.error("Update profile API error details:", {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    throw err;
  }
}
