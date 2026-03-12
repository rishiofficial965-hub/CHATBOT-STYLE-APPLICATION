import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Nav from "../components/Nav";
import Loader from "../components/Loader";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [eyetoggle, setEyetoggle] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { handleRegister, loading } = useAuth();
  if (loading) return <Loader />;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await handleRegister(name, email, username, password);
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setName("");
    setEmail("");
    setUsername("");
    setPassword("");
  }

  return (
    <main className="relative flex justify-center items-center h-screen bg-[#191a1a]">
      <Nav />
      <div className="bg-[#202222] border border-[#2a2b2b] rounded-2xl p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="flex justify-center items-center font-semibold text-white/90 gap-2">
          <i className="fa-solid fa-person-circle-plus text-2xl text-[#20b8cd]"></i>
          <h1 className="text-3xl font-light">Register</h1>
        </div>

        {error && <p className="text-red-400 font-medium text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            name="name"
            placeholder="Enter your name"
            className="bg-[#2a2b2b] text-white/90 font-medium placeholder-white/30 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#20b8cd]/50 border border-[#353636] transition"
          />
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            name="username"
            placeholder="Enter a unique username"
            className="bg-[#2a2b2b] text-white/90 font-medium placeholder-white/30 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#20b8cd]/50 border border-[#353636] transition"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            name="email"
            placeholder="Enter email address"
            className="bg-[#2a2b2b] text-white/90 font-medium placeholder-white/30 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#20b8cd]/50 border border-[#353636] transition"
          />
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
              className="absolute right-3 top-3 cursor-pointer"
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

          <button
            type="submit"
            className="rounded-lg bg-[#20b8cd] text-[#191a1a] font-semibold px-4 py-3 hover:bg-[#1ca8bc] transition active:scale-[0.98] cursor-pointer"
          >
            Register
          </button>
        </form>
        <p className="text-white/50 font-medium text-sm">
          Already have an account?{" "}
          <Link className="text-[#20b8cd] font-semibold hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegistrationForm;
