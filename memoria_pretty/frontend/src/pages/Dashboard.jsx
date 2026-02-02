import { useEffect, useState } from "react";
import { api } from "../api.js";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [moments, setMoments] = useState([]);
  const [stats, setStats] = useState({ total: 0, totalViews: 0, moods: {} });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const userRes = await api.get("/auth/me");
        setMe(userRes.data.user);

        const momentsRes = await api.get("/moments?limit=6");
        const momentsList = momentsRes.data.items || momentsRes.data;
        setMoments(momentsList);

        const total = momentsList.length;
        const totalViews = momentsList.reduce((sum, m) => sum + (m.views || 0), 0);
        const moods = {};
        momentsList.forEach(m => {
          moods[m.mood] = (moods[m.mood] || 0) + 1;
        });

        setStats({ total, totalViews, moods });
      } catch (e) {
        setErr(e?.response?.data?.message || "Cannot load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div className="loading" style={{ margin: "0 auto", width: "40px", height: "40px" }}></div>
          <p style={{ marginTop: "1rem" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container">
        <div className="alert alert-error">{err}</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Welcome Card */}
      <div className="card" style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        marginBottom: "2rem",
        border: "none"
      }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "white" }}>
          Welcome back, {me?.name}! 👋
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.95, color: "white" }}>
          Let's capture today's moments
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-3" style={{ marginBottom: "2rem" }}>
        <div className="card" style={{ 
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
          textAlign: "center",
          border: "none"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📝</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "white" }}>{stats.total}</div>
          <div style={{ fontSize: "1rem", opacity: 0.95, color: "white" }}>Total Moments</div>
        </div>

        <div className="card" style={{ 
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          color: "white",
          textAlign: "center",
          border: "none"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>👁️</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "white" }}>{stats.totalViews}</div>
          <div style={{ fontSize: "1rem", opacity: 0.95, color: "white" }}>Total Views</div>
        </div>

        <div className="card" style={{ 
          background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
          color: "white",
          textAlign: "center",
          border: "none"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>😊</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "white" }}>
            {Object.keys(stats.moods).length}
          </div>
          <div style={{ fontSize: "1rem", opacity: 0.95, color: "white" }}>Different Moods</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>🚀 Quick Actions</h2>
        <div className="grid grid-2">
          <Link 
            to="/moments/new" 
            className="btn" 
            style={{ 
              padding: "1.5rem",
              fontSize: "1.1rem",
              justifyContent: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              textDecoration: "none"
            }}
          >
            ✨ Create New Moment
          </Link>
          <Link 
            to="/memories" 
            style={{ 
              padding: "1.5rem",
              fontSize: "1.1rem",
              justifyContent: "center",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              transition: "all 0.3s"
            }}
          >
            📚 View Memories
          </Link>
        </div>
      </div>

      {/* Recent Moments */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📌 Recent Moments</h2>
          <Link to="/search" className="btn-outline">
            View All →
          </Link>
        </div>

        {moments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📝</div>
            <p style={{ fontSize: "1.2rem", color: "var(--gray)", marginBottom: "1.5rem" }}>
              No moments yet. Create your first one!
            </p>
            <Link 
              to="/moments/new" 
              className="btn" 
              style={{ 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "inline-flex"
              }}
            >
              ✨ Create Moment
            </Link>
          </div>
        ) : (
          <div className="grid grid-2">
            {moments.map(m => (
              <div 
                key={m._id} 
                className="card" 
                style={{ 
                  background: "var(--white)",
                  border: "2px solid #e5e7eb",
                  padding: "1.5rem"
                }}
              >
                {/* Media Preview */}
                {m.media && m.media.length > 0 && (
                  <img 
                    src={`http://localhost:5000${m.media[0].url}`}
                    alt="Moment"
                    style={{ 
                      width: "100%", 
                      height: "180px", 
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "1rem"
                    }}
                  />
                )}
                
                {/* Text Content */}
                <p style={{ 
                  marginBottom: "1rem",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  color: "var(--dark)",
                  minHeight: "48px"
                }}>
                  {m.text.substring(0, 100)}{m.text.length > 100 ? "..." : ""}
                </p>
                
                {/* Metadata */}
                <div style={{ 
                  display: "flex", 
                  gap: "0.5rem", 
                  marginBottom: "1rem",
                  flexWrap: "wrap"
                }}>
                  <span 
                    className="badge" 
                    style={{ 
                      background: "#ec4899",
                      color: "white",
                      padding: "0.5rem 0.75rem"
                    }}
                  >
                    😊 {m.mood}
                  </span>
                  <span 
                    className="badge" 
                    style={{ 
                      background: "#6366f1",
                      color: "white",
                      padding: "0.5rem 0.75rem"
                    }}
                  >
                    👁️ {m.views}
                  </span>
                </div>
                
                {/* View Button */}
                <Link 
                  to={`/moments/${m._id}`} 
                  style={{ 
                    width: "100%",
                    padding: "0.875rem",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "600",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "block",
                    transition: "all 0.3s"
                  }}
                >
                  👁️ View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
