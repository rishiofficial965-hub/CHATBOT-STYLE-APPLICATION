import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <nav className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-[#202222]/80 backdrop-blur-xl rounded-full px-8 py-3 flex items-center justify-between border border-[#2a2b2b] z-50">
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <span className="text-white/90 text-2xl font-light tracking-wide">
          perplexity
        </span>
      </Link>

      <div className="flex-1"></div>

      <div className="flex justify-end gap-6 text-white/60 text-[20px] px-2">
        {isLoginPage ? (
          <Link to="/register" className="hover:text-[#20b8cd] transition flex items-center" title="Sign Up">
            <i className="fa-solid fa-user-plus"></i>
          </Link>
        ) : (
          <Link to="/login" className="hover:text-[#20b8cd] transition flex items-center" title="Login">
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
