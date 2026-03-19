import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  register as registerApi, 
  login as loginApi, 
  getMe as getMeApi, 
  verifyOTP as verifyOTPApi, 
  sendOTP as sendOTPApi,
  forgotPassword as forgotPasswordApi,
  verifyResetOTP as verifyResetOTPApi,
  resetPassword as resetPasswordApi
} from "./services/auth.api";

// Async Thunks
export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, username, password }, { rejectWithValue }) => {
    try {
      return await registerApi(name, email, username, password);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginApi(credentials);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid username or password");
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      return await getMeApi();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Session expired");
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (otp, { rejectWithValue }) => {
    try {
      const data = await verifyOTPApi(otp);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid or expired OTP");
    }
  }
);

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (_, { rejectWithValue }) => {
    try {
      return await sendOTPApi();
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error resending OTP");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      return await forgotPasswordApi(email);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send reset email");
    }
  }
);

export const verifyResetOTP = createAsyncThunk(
  "auth/verifyResetOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      return await verifyResetOTPApi(email, otp);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid or expired OTP");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      return await resetPasswordApi(email, otp, newPassword);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password reset failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isInitialized: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isInitialized = true;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) state.user = action.payload.user;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyResetOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyResetOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;