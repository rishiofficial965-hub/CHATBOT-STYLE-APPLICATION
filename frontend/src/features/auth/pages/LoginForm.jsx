import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Nav from "../components/Nav";
import Loader from "../components/Loader";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eyetoggle, setEyetoggle] = useState(true);
  const [useEmailLogin, setUseEmailLogin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { handleLogin, loading } = useSelector((state) => state.auth);

  if (loading) return <Loader />;

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

  return (
    <main className="relative flex justify-center items-center h-screen bg-[#191a1a]">
      <Nav />
      <div className="bg-[#202222] border border-[#2a2b2b] rounded-2xl p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="flex justify-center items-center font-semibold text-white/90 gap-2">
          <i className="text-2xl text-[#20b8cd] fa-solid fa-arrow-right-to-bracket"></i>
          <h1 className="text-3xl font-light">Login</h1>
        </div>

        {error && <p className="text-red-400 font-medium text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          
          <div className="flex flex-col gap-4">
            {!useEmailLogin ? (
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                name="username"
                placeholder="Enter username"
                className="bg-[#2a2b2b] text-white/90 font-medium placeholder-white/30 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#20b8cd]/50 border border-[#353636] transition"
              />
            ) : (
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                name="email"
                placeholder="Enter email address"
                className="bg-[#2a2b2b] text-white/90 font-medium placeholder-white/30 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#20b8cd]/50 border border-[#353636] transition"
              />
            )}

            <div className="relative w-full">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={eyetoggle ? "password" : "text"}
                name="password"
                placeholder="Enter password"
                className="bg-[#2a2b2b] w-full text-white/90 font-medium placeholder-white/30 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#20b8cd]/50 border border-[#353636] transition"
              />
              <div
                onClick={() => setEyetoggle(!eyetoggle)}
                className="absolute right-3 top-3.5 cursor-pointer"
              >
                <div className="text-white/40 text-md hover:text-white/70 transition">
                  {eyetoggle ? (
                    <i className="fa-solid fa-eye-slash"></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end text-xs gap-3">
            <span className={`transition-colors duration-300 ${!useEmailLogin ? 'text-[#20b8cd]' : 'text-white/40'}`}>
              Username
            </span>
            <button
              type="button"
              onClick={() => setUseEmailLogin(!useEmailLogin)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                useEmailLogin ? 'bg-[#20b8cd]' : 'bg-[#353636]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  useEmailLogin ? 'translate-x-[22px]' : 'translate-x-[2px]'
                }`}
              />
            </button>
            <span className={`transition-colors duration-300 ${useEmailLogin ? 'text-[#20b8cd]' : 'text-white/40'}`}>
              Email
            </span>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-[#20b8cd] text-[#191a1a] font-semibold px-4 py-3 hover:bg-[#1ca8bc] transition active:scale-[0.98] cursor-pointer mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-white/50 font-medium text-sm">
          Don't have an account?{" "}
          <Link className="text-[#20b8cd] font-semibold hover:underline" to="/register">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginForm;
