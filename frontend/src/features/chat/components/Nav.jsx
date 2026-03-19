import React from "react";

const Nav = () => {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-[#0E0E0E]/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center px-6">
            <div className="flex items-center gap-2.5 group cursor-pointer">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12 duration-300">
                    <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">Perplexity</h1>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 cursor-pointer hover:bg-white/20 transition-all">
                    <i className="ri-user-3-line text-lg"></i>
                </div>
            </div>
        </header>
    );
};

export default Nav;