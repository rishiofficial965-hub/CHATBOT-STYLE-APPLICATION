import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../auth/auth.slice";
import { useChat } from "../hooks/useChat";
import axios from "axios";

const SideBar = ({ toggle, setToggle }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { chats, currentChatId, isLoading, startNewChat, loadChat, deleteChat } = useChat();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout", {}, { withCredentials: true });
        } catch (e) { /* silent */ }
        dispatch(logout());
        navigate("/login");
    };

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";

    return (
        <aside className={`h-[calc(100vh-4rem)] fixed left-0 top-16 z-40 flex flex-col transition-all duration-500 ease-in-out ${toggle ? "w-64" : "w-16"} bg-[#0E0E0E] border-r border-white/5 text-white overflow-hidden`}>

            {/* Header row */}
            <div className="flex items-center justify-between px-3 pt-4 pb-2">
                {toggle && (
                    <button
                        onClick={() => { startNewChat(); if (!toggle) setToggle(true); }}
                        className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
                    >
                        <i className="ri-add-circle-line text-lg"></i>
                        <span>New chat</span>
                    </button>
                )}
                <button
                    onClick={() => setToggle(!toggle)}
                    className={`p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all ml-auto`}
                >
                    <i className={`ri-menu-line text-xl transition-transform duration-500 ${toggle ? "rotate-180" : ""}`}></i>
                </button>
            </div>

            {/* New chat icon (collapsed) */}
            {!toggle && (
                <button
                    onClick={() => { startNewChat(); setToggle(true); }}
                    className="mx-auto mb-2 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all"
                >
                    <i className="ri-add-line text-xl"></i>
                </button>
            )}

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar">
                {isLoading ? (
                    <div className="space-y-2 px-2 mt-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-9 bg-white/5 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : chats.length === 0 ? (
                    toggle && (
                        <p className="text-white/20 text-xs text-center mt-8 px-4">No conversations yet. Start one!</p>
                    )
                ) : (
                    chats.map((chat) => (
                        <div
                            key={chat._id}
                            onClick={() => loadChat(chat._id)}
                            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                                currentChatId === chat._id
                                    ? "bg-white/10 text-white"
                                    : "text-white/50 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <i className="ri-message-3-line text-base flex-shrink-0"></i>
                            {toggle && (
                                <span className="text-sm truncate flex-1 leading-tight">{chat.title}</span>
                            )}
                            {toggle && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteChat(chat._id); }}
                                    className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all flex-shrink-0"
                                    title="Delete"
                                >
                                    <i className="ri-delete-bin-line text-base"></i>
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* User / Logout */}
            <div className="p-3 border-t border-white/5 space-y-1">
                {/* User info row (expanded only) */}
                {toggle && (
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs font-bold flex-shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white/70 truncate">{user?.name}</p>
                            <p className="text-xs text-white/30 truncate">{user?.email}</p>
                        </div>
                    </div>
                )}

                {/* Logout button — always visible */}
                <button
                    onClick={handleLogout}
                    className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 hover:bg-red-500/10 active:scale-95 ${
                        !toggle ? 'justify-center' : ''
                    }`}
                >
                    <i className="ri-logout-box-line text-lg text-white/30 group-hover:text-red-400 transition-colors flex-shrink-0"></i>
                    {toggle && (
                        <span className="text-sm font-medium text-white/40 group-hover:text-red-400 transition-colors">
                            Sign out
                        </span>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default SideBar;