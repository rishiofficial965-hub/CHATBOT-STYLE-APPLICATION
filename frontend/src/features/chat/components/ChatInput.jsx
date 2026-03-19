import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, isSending }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isSending) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const canSend = message.trim() && !isSending;

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl px-4 md:px-8 pb-10"
        >
            <div className="relative group p-[1px] rounded-[22px] bg-gradient-to-b from-white/10 to-white/5 focus-within:from-white/20 transition-all duration-500 shadow-2xl">
                <div className="relative flex items-center bg-[#111111] rounded-[21px] p-2 transition-all duration-300 group-focus-within:bg-[#0D0D0D]">
                    <button
                        type="button"
                        disabled={isSending}
                        className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all duration-300 disabled:opacity-30"
                    >
                        <i className="ri-add-line text-xl"></i>
                    </button>

                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSending}
                        placeholder="Ask anything..."
                        rows={1}
                        className="flex-1 bg-transparent border-none outline-none text-white/90 px-4 py-2 text-[17px] font-normal placeholder:text-white/20 resize-none overflow-y-auto custom-scrollbar disabled:opacity-30"
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
                        }}
                    />

                    <div className="flex items-center gap-1.5 pr-1">
                        <button
                            type="button"
                            disabled={isSending}
                            className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all duration-300 disabled:opacity-30"
                        >
                            <i className="ri-mic-2-line text-xl"></i>
                        </button>
                        <button
                            type="submit"
                            disabled={!canSend}
                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ${
                                canSend
                                    ? 'bg-white text-black scale-100 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                    : 'bg-white/5 text-white/20 scale-90 cursor-not-allowed'
                            }`}
                        >
                            {isSending ? (
                                <i className="ri-loader-4-line text-xl animate-spin"></i>
                            ) : (
                                <i className="ri-arrow-up-line text-xl font-bold"></i>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-white/15 font-medium uppercase tracking-widest">
                <span className="hover:text-white/30 transition-colors cursor-pointer">Pro Search</span>
                <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                <span className="hover:text-white/30 transition-colors cursor-pointer">Writing</span>
                <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                <span className="hover:text-white/30 transition-colors cursor-pointer">Generate Image</span>
            </div>
        </form>
    );
};

export default ChatInput;
