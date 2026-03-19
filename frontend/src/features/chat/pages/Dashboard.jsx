import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";
import SideBar from "../components/Sidebar.jsx";
import Nav from "../components/Nav.jsx";
import ChatSection from "../components/ChatSection.jsx";

const Dashboard = () => {
  const [toggle, setToggle] = useState(true);
  const user = useSelector((state) => state.auth.user);
  const { fetchChats, messages, sendMessage, isSending } = useChat();

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    // h-screen + overflow-hidden locks the page to exactly the viewport — no body scroll
    <main className="h-screen bg-[#090909] flex flex-col overflow-hidden text-white/90">
      <Nav />
      {/* mt-16 pushes content below the fixed Nav, flex-1 fills remaining height */}
      <div className="flex flex-1 overflow-hidden mt-16">
        <SideBar toggle={toggle} setToggle={setToggle} />
        {/* h-full + overflow-hidden lets ChatSection resolve h-full correctly */}
        <div
          className={`flex-1 h-full overflow-hidden flex flex-col transition-all duration-500 ${toggle ? "pl-64" : "pl-16"}`}
        >
          <ChatSection messages={messages} onSendMessage={sendMessage} isSending={isSending} />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
