import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Nav from "../components/Nav";
import Loader from "../components/Loader";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    handleVerifyOTP, 
    handleSendOTP, 
    handleVerifyResetOTP,
    handleForgotPassword,
    loading, 
    user 
  } = useAuth();

  const isResetFlow = location.state?.flow === "reset";
  const resetEmail = location.state?.email;

  useEffect(() => {
    if (isResetFlow) {
      if (!resetEmail) {
        navigate("/forgot-password");
      }
    } else {
      if (!user) {
        navigate("/login");
      }
    }
  }, [user, isResetFlow, resetEmail, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    if (isResetFlow) {
      const result = await handleVerifyResetOTP(resetEmail, otp);
      if (result.success) {
        navigate("/reset-password", { state: { email: resetEmail, otp } });
      } else {
        setError(result.error || "Verification failed");
      }
    } else {
      const result = await handleVerifyOTP(otp);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Verification failed");
      }
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    
    if (isResetFlow) {
      const result = await handleForgotPassword(resetEmail);
      if (result.success) {
        setMessage("Reset code resent successfully!");
      } else {
        setError(result.error);
      }
    } else {
      const result = await handleSendOTP();
      if (result.success) {
        setMessage("OTP resent successfully!");
      } else {
        setError(result.error);
      }
    }
  };

  if (loading) return <Loader />;

  const inputClass =
    "w-full bg-[#171717] text-white font-semibold text-center text-3xl tracking-[0.4em] placeholder:tracking-normal placeholder:text-base placeholder:font-normal placeholder-white/20 px-4 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 border border-white/5 transition-all";

  return (
    <main className="relative flex justify-center items-center h-screen bg-[#0d0d0d] overflow-hidden">
      <Nav />
      <div
        className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm px-6 border border-white/10 rounded-2xl py-10 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            <i className="ri-shield-check-line text-black text-2xl"></i>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Enter code
          </h1>
          <p className="text-white/40 text-[15px] font-medium text-center">
            We sent a 6-digit code to your email.
          </p>
        </div>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}
        {message && (
          <div className="w-full bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
            <p className="text-green-400 text-sm text-center font-medium">
              {message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <input
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              if (val.length <= 6) setOtp(val);
            }}
            value={otp}
            type="text"
            name="otp"
            placeholder="000000"
            className={inputClass}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-semibold py-3.5 hover:bg-neutral-200 transition-all active:scale-[0.98] cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.1)] disabled:opacity-50"
          >
            Verify code
          </button>
        </form>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-white/40 text-sm font-medium hover:text-white transition-colors"
          >
            Resend code
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-white/40 text-sm font-medium hover:text-white transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 flex gap-4 text-[11px] text-white/20 font-medium tracking-wide">
        <span>Terms of use</span>
        <span className="w-1 h-1 bg-white/10 rounded-full mt-1.5"></span>
        <span>Privacy policy</span>
      </div>
    </main>
  );
};

export default VerifyOTP;
