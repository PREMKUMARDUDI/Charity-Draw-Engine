import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon, Activity, Heart } from "lucide-react";
import useAuthStore from "../store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight"
        >
          <Activity className="text-accent" size={24} />
          <span>
            Impact<span className="text-accent">Play</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-slate-600 hover:text-indigo-600 font-bold transition-colors flex items-center gap-1 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100"
                >
                  Admin Panel
                </Link>
              )}

              <Link
                to="/dashboard"
                className="text-slate-600 hover:text-accent font-medium transition-colors"
              >
                Dashboard
              </Link>

              <Link
                to="/impact"
                className="text-slate-600 hover:text-charity font-medium transition-colors flex items-center gap-1"
              >
                <Heart size={16} /> Impact
              </Link>

              <div className="h-6 w-px bg-slate-200"></div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <UserIcon size={16} className="text-slate-400" />
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-600 hover:text-accent font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
