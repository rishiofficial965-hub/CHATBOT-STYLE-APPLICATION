import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Nav from "../components/Nav";
import Loader from "../components/Loader";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { handleVerifyOTP, handleSendOTP, loading, user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    const result = await handleVerifyOTP(otp);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Verification failed");
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    const result = await handleSendOTP();
    if (result.success) {
      setMessage("OTP resent successfully!");
    } else {
      setError(result.error);
    }
  };

  if (loading) return <Loader />;

  return (
    <main className="relative flex justify-center items-center h-screen bg-[#191a1a]">
      <Nav />
      <div className="bg-[#202222] border border-[#2a2b2b] rounded-2xl p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="flex justify-center items-center font-semibold text-white/90 gap-2">
          <i className="text-2xl text-[#20b8cd] fa-solid fa-shield-halved"></i>
          <h1 className="text-3xl font-light">Verify OTP</h1>
        </div>

        <p className="text-center text-white/50 font-medium text-sm max-w-[280px]">
          Enter the verification code sent to your email.
        </p>

        {error && <p className="text-red-400 font-medium text-sm">{error}</p>}
        {message && <p className="text-emerald-400 font-medium text-sm">{message}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <input
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              if (val.length <= 6) setOtp(val);
            }}
            value={otp}
            type="text"
            name="otp"
            placeholder="Enter 6-digit OTP"
            className="bg-[#2a2b2b] text-white/90 font-medium text-center text-2xl tracking-[0.5em] placeholder:tracking-normal placeholder:text-base placeholder-white/30 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#20b8cd]/50 border border-[#353636] transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#20b8cd] text-[#191a1a] font-semibold px-4 py-3 hover:bg-[#1ca8bc] transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-white/50 font-medium text-sm">
          Didn't receive code?{" "}
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-[#20b8cd] font-semibold hover:underline"
          >
            Resend
          </button>
        </div>
      </div>
    </main>
  );
};

export default VerifyOTP;
