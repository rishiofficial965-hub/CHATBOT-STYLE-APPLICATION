import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Nav from "../components/Nav";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [eyetoggle, setEyetoggle] = useState(true);
  const [eyetoggleConfirm, setEyetoggleConfirm] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { handleResetPassword, loading } = useAuth();
  
  const email = location.state?.email;
  const otp = location.state?.otp;

  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const result = await handleResetPassword(email, otp, newPassword);

    if (!result.success) {
      setError(result.error || "Failed to reset password");
      return;
    }

    setMessage("Password reset successfully! Redirecting...");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  const inputClass =
    "w-full bg-[#171717] text-white font-normal placeholder-white/20 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 border border-white/5 transition-all";

  return (
    <main className="relative flex justify-center items-center h-screen bg-[#0d0d0d] overflow-hidden">
      <Nav />
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm border border-white/10 rounded-2xl px-8 py-8 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            <i className="ri-key-line text-black text-2xl"></i>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            New Password
          </h1>
          <p className="text-white/40 text-[15px] font-medium text-center">
            Enter your new secure password.
          </p>
        </div>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm text-center font-medium">{error}</p>
          </div>
        )}
        {message && (
          <div className="w-full bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
            <p className="text-green-400 text-sm text-center font-medium">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="relative w-full">
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              type={eyetoggle ? "password" : "text"}
              placeholder="New password"
              className={inputClass}
            />
            <div
              onClick={() => setEyetoggle(!eyetoggle)}
              className="absolute right-4 top-3.5 cursor-pointer text-white/30 hover:text-white/60 transition"
            >
              <i className={`ri-${eyetoggle ? "eye-off-line" : "eye-line"} text-lg`}></i>
            </div>
          </div>
          
          <div className="relative w-full">
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type={eyetoggleConfirm ? "password" : "text"}
              placeholder="Confirm new password"
              className={inputClass}
            />
            <div
              onClick={() => setEyetoggleConfirm(!eyetoggleConfirm)}
              className="absolute right-4 top-3.5 cursor-pointer text-white/30 hover:text-white/60 transition"
            >
              <i className={`ri-${eyetoggleConfirm ? "eye-off-line" : "eye-line"} text-lg`}></i>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!message}
            className="w-full rounded-xl bg-white text-black font-semibold py-3.5 hover:bg-neutral-200 transition-all active:scale-[0.98] cursor-pointer mt-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
      <div className="absolute bottom-6 flex gap-4 text-[11px] text-white/20 font-medium tracking-wide">
        <span>Terms of use</span>
        <span className="w-1 h-1 bg-white/10 rounded-full mt-1.5"></span>
        <span>Privacy policy</span>
      </div>
    </main>
  );
};
export default ResetPassword;
