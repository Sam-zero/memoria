import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [me, setMe] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      background: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(16, 185, 129, 0.15)",
      boxShadow: "0 2px 12px rgba(16, 185, 129, 0.08)"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.875rem 1.5rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* 🎨 Logo with Icon */}
        <Link to="/dashboard" style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          textDecoration: "none"
        }}>
          <img 
            src="/logo.png" 
            alt="Memoria" 
            style={{ 
              width: "40px", 
              height: "40px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)"
            }} 
          />
          <span style={{
            fontSize: "1.5rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.5px"
          }}>
            Memoria
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ 
          display: "flex", 
          gap: "0.5rem", 
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <Link 
            to="/dashboard" 
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.2s",
              background: isActive("/dashboard") 
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                : "transparent",
              color: isActive("/dashboard") ? "white" : "#064e3b",
              boxShadow: isActive("/dashboard") 
                ? "0 4px 12px rgba(16, 185, 129, 0.3)" 
                : "none"
            }}
          >
            🏠 Dashboard
          </Link>

          <Link 
            to="/moments/new" 
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.2s",
              background: isActive("/moments/new") 
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                : "transparent",
              color: isActive("/moments/new") ? "white" : "#064e3b",
              boxShadow: isActive("/moments/new") 
                ? "0 4px 12px rgba(16, 185, 129, 0.3)" 
                : "none"
            }}
          >
            ✨ New Moment
          </Link>

          <Link 
            to="/memories" 
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.2s",
              background: isActive("/memories") 
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                : "transparent",
              color: isActive("/memories") ? "white" : "#064e3b",
              boxShadow: isActive("/memories") 
                ? "0 4px 12px rgba(16, 185, 129, 0.3)" 
                : "none"
            }}
          >
            📚 Memories
          </Link>

          <Link 
            to="/analytics" 
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.2s",
              background: isActive("/analytics") 
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                : "transparent",
              color: isActive("/analytics") ? "white" : "#064e3b",
              boxShadow: isActive("/analytics") 
                ? "0 4px 12px rgba(16, 185, 129, 0.3)" 
                : "none"
            }}
          >
            📊 Analytics
          </Link>

          <Link 
            to="/search" 
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.2s",
              background: isActive("/search") 
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                : "transparent",
              color: isActive("/search") ? "white" : "#064e3b",
              boxShadow: isActive("/search") 
                ? "0 4px 12px rgba(16, 185, 129, 0.3)" 
                : "none"
            }}
          >
            🔍 Search
          </Link>

          <Link 
            to="/profile" 
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "all 0.2s",
              background: isActive("/profile") 
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                : "transparent",
              color: isActive("/profile") ? "white" : "#064e3b",
              boxShadow: isActive("/profile") 
                ? "0 4px 12px rgba(16, 185, 129, 0.3)" 
                : "none"
            }}
          >
            👤 Profile
          </Link>

          <button 
            onClick={logout}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "10px",
              border: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              cursor: "pointer",
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white",
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
              transition: "all 0.2s"
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
