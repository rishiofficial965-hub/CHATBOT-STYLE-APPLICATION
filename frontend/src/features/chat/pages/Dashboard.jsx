import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, handleLogout } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate("/login");

    const chat = useChat();

    useEffect(() => {
      chat.initializeSocketConnection();
    }, []);
  };

  return (
    <main className="min-h-screen bg-[#191a1a] flex flex-col items-center justify-center p-4">
      <div className="bg-[#202222] border border-[#2a2b2b] p-12 rounded-2xl flex flex-col items-center gap-8 max-w-md w-full">
        <div className="w-20 h-20 bg-[#2a2b2b] rounded-full flex items-center justify-center border border-[#353636]">
          <i className="fa-solid fa-user text-4xl text-[#20b8cd]"></i>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-light text-white/90 mb-2">Welcome!</h1>
          <p className="text-white/50 font-medium">
            Logged in as{" "}
            <span className="text-[#20b8cd]">@{user?.name || "user"}</span>
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 mt-2">
          <div className="bg-[#2a2b2b] p-4 rounded-xl border border-[#353636] flex items-center gap-4">
            <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
            <span className="text-white/70 font-medium text-sm">
              Registration Complete
            </span>
          </div>
          <div className="bg-[#2a2b2b] p-4 rounded-xl border border-[#353636] flex items-center gap-4">
            <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
            <span className="text-white/70 font-medium text-sm">
              OTP Verified
            </span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="mt-2 px-8 py-3 bg-[#2a2b2b] border border-[#353636] hover:bg-[#353636] text-white/70 font-semibold rounded-xl transition-all active:scale-[0.98] cursor-pointer text-sm"
        >
          Logout
        </button>
      </div>
    </main>
  );
};

export default Dashboard;
