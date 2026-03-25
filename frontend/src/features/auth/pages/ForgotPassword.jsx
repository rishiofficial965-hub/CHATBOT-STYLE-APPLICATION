import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Nav from "../components/Nav";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { handleForgotPassword, loading } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    const result = await handleForgotPassword(email);

    if (!result.success) {
      setError(result.error || "Failed to send reset link");
      return;
    }

    navigate("/verify-otp", { state: { flow: "reset", email } });
  }

  const inputClass =
    "w-full bg-[#171717] text-white font-normal placeholder-white/20 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 border border-white/5 transition-all";

  return (
    <main className="relative flex justify-center items-center h-screen bg-[#0d0d0d] overflow-hidden">
      <Nav />
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm border border-white/10 rounded-2xl px-8 py-8 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            <i className="ri-lock-password-line text-black text-2xl"></i>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Reset Password
          </h1>
          <p className="text-white/40 text-[15px] font-medium text-center leading-relaxed">
            Enter your email to receive a password reset code.
          </p>
        </div>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email address"
            className={inputClass}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-semibold py-3.5 hover:bg-neutral-200 transition-all active:scale-[0.98] cursor-pointer mt-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

        <Link
          className="text-white/40 text-sm font-medium hover:text-white transition-colors"
          to="/login"
        >
          Back to login
        </Link>
      </div>
      <div className="absolute bottom-6 flex gap-4 text-[11px] text-white/20 font-medium tracking-wide">
        <span>Terms of use</span>
        <span className="w-1 h-1 bg-white/10 rounded-full mt-1.5"></span>
        <span>Privacy policy</span>
      </div>
    </main>
  );
};

export default ForgotPassword;
