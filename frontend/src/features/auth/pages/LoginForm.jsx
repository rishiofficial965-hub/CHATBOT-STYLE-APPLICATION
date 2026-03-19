import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Nav from "../components/Nav";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eyetoggle, setEyetoggle] = useState(true);
  const [useEmailLogin, setUseEmailLogin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { handleLogin, loading } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const credentials = useEmailLogin
      ? { email, password }
      : { username, password };

    const result = await handleLogin(credentials);

    if (!result.success) {
      setError(result.error || "Invalid credentials");
      setPassword("");
      return;
    }

    navigate("/dashboard");
    setEmail("");
    setUsername("");
    setPassword("");
  }

  const inputClass =
    "w-full bg-[#171717] text-white font-normal placeholder-white/20 px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20 border border-white/5 transition-all";

  return (
    <main className="relative flex justify-center items-center h-screen bg-[#0d0d0d] overflow-hidden">
      <Nav />

      <div
        className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm border border-white/10 rounded-2xl px-8 py-6 
shadow-[0_0_20px_rgba(255,255,255,0.15)]"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            <div className="w-6 h-6 bg-black rounded-sm rotate-45"></div>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>
        </div>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-3">
            {!useEmailLogin ? (
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                name="username"
                placeholder="Username"
                className={inputClass}
              />
            ) : (
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                name="email"
                placeholder="Email address"
                className={inputClass}
              />
            )}

            <div className="relative w-full">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={eyetoggle ? "password" : "text"}
                name="password"
                placeholder="Password"
                className={inputClass}
              />
              <div
                onClick={() => setEyetoggle(!eyetoggle)}
                className="absolute right-4 top-3.5 cursor-pointer text-white/30 hover:text-white/60 transition"
              >
                <i
                  className={`ri-${eyetoggle ? "eye-off-line" : "eye-line"} text-lg`}
                ></i>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs px-1">
            <button
              type="button"
              onClick={() => setUseEmailLogin(!useEmailLogin)}
              className="text-white/40 hover:text-white transition-colors font-medium"
            >
              Sign in with {useEmailLogin ? "Username" : "Email"}
            </button>
            <Link
              to="/forgot-password"
              title="Coming soon"
              className="text-white/40 hover:text-white transition-colors cursor-not-allowed"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-semibold py-3.5 hover:bg-neutral-200 transition-all active:scale-[0.98] cursor-pointer mt-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="text-white/40 text-sm font-medium">
          Don't have an account?{" "}
          <Link
            className="text-white hover:underline underline-offset-4 decoration-white/30"
            to="/register"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="absolute bottom-6 flex gap-4 text-[11px] text-white/20 font-medium tracking-wide">
        <span>Terms of use</span>
        <span className="w-1 h-1 bg-white/10 rounded-full mt-1.5"></span>
        <span>Privacy policy</span>
      </div>
    </main>
  );
};

export default LoginForm;
