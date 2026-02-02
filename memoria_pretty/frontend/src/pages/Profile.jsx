import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useNavigate } from "react-router-dom";
import { logout } from "../auth.js";

export default function Profile() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ moments: 0, memories: 0, totalViews: 0 });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Get user info
        const userRes = await api.get("/auth/me");
        setUser(userRes.data.user);

        // Get stats
        const momentsRes = await api.get("/moments");
        const memoriesRes = await api.get("/memories");
        
        const momentsList = momentsRes.data.items || momentsRes.data;
        const memoriesList = memoriesRes.data;
        
        const totalViews = momentsList.reduce((sum, m) => sum + (m.views || 0), 0);
        
        setStats({
          moments: momentsList.length,
          memories: memoriesList.length,
          totalViews
        });
      } catch (e) {
        setErr(e?.response?.data?.message || "Cannot load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  if (loading) {
    return (
      <div className="container profile-container">
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div className="loading" style={{ margin: "0 auto", width: "40px", height: "40px" }}></div>
          <p style={{ marginTop: "1rem" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container profile-container">
        <div className="alert alert-error">{err}</div>
      </div>
    );
  }

  return (
    <div className="container profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          👤
        </div>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          {user?.name}
        </h1>
        <p style={{ opacity: 0.9, fontSize: "1.1rem" }}>
          Member since {new Date(user?.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-3" style={{ marginBottom: "2rem" }}>
        <div className="card" style={{ 
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          textAlign: "center",
          border: "none"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📝</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>{stats.moments}</div>
          <div style={{ fontSize: "1rem", opacity: 0.9 }}>Moments</div>
        </div>

        <div className="card" style={{ 
          background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
          color: "white",
          textAlign: "center",
          border: "none"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📚</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>{stats.memories}</div>
          <div style={{ fontSize: "1rem", opacity: 0.9 }}>Memories</div>
        </div>

        <div className="card" style={{ 
          background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)",
          color: "white",
          textAlign: "center",
          border: "none"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>👁️</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "700" }}>{stats.totalViews}</div>
          <div style={{ fontSize: "1rem", opacity: 0.9 }}>Total Views</div>
        </div>
      </div>

      {/* Account Information */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: "1.5rem" }}>
          🔐 Account Information
        </h2>
        
        <div className="profile-info-grid">
          <div className="profile-field">
            <div className="profile-field-label">👤 Full Name</div>
            <div className="profile-field-value">{user?.name}</div>
          </div>

          <div className="profile-field">
            <div className="profile-field-label">📧 Email Address</div>
            <div className="profile-field-value">{user?.email}</div>
          </div>

          <div className="profile-field">
            <div className="profile-field-label">📅 Member Since</div>
            <div className="profile-field-value">
              {new Date(user?.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-2" style={{ marginTop: "2rem" }}>
        <button 
          onClick={handleLogout}
          className="btn-danger"
          style={{ 
            padding: "1.25rem",
            fontSize: "1.1rem",
            justifyContent: "center"
          }}
        >
          🚪 Logout
        </button>
        <button 
          onClick={() => nav("/settings")}
          className="btn-outline"
          style={{ 
            padding: "1.25rem",
            fontSize: "1.1rem",
            justifyContent: "center"
          }}
        >
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
}
