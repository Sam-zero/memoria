import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await api.get("/analytics");
        setData(res.data);
      } catch (e) {
        setErr(e?.response?.data?.message || "Cannot load analytics");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div className="loading" style={{ 
            margin: "0 auto", 
            width: "50px", 
            height: "50px",
            borderTopColor: "#10b981"
          }}></div>
          <p style={{ marginTop: "1rem", color: "#064e3b", fontWeight: "600" }}>
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container">
        <div className="alert alert-error">{err}</div>
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
          <h3 style={{ marginBottom: "1rem" }}>Could not load analytics</h3>
          <p style={{ color: "var(--gray)", marginBottom: "1.5rem" }}>
            {err}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              padding: "1rem 2rem",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem"
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📊</div>
          <p style={{ fontSize: "1.2rem", color: "var(--gray)" }}>
            No analytics data available
          </p>
        </div>
      </div>
    );
  }

  const { totalMoments = 0, totalMemories = 0, totalViews = 0, moodDistribution = [], tagCloud = [], timeline = [] } = data;

  return (
    <div className="container">
      {/* Header */}
      <div className="card" style={{ 
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        marginBottom: "2rem",
        border: "none"
      }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", color: "white" }}>
          📊 Analytics Dashboard
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
          Your memory insights and statistics
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-3" style={{ marginBottom: "2rem" }}>
        <div className="card" style={{ 
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          textAlign: "center",
          border: "none"
        }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>📝</div>
          <div style={{ fontSize: "3rem", fontWeight: "700" }}>{totalMoments}</div>
          <div style={{ fontSize: "1.1rem", opacity: 0.9 }}>Total Moments</div>
        </div>

        <div className="card" style={{ 
          background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
          color: "white",
          textAlign: "center",
          border: "none"
        }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>📚</div>
          <div style={{ fontSize: "3rem", fontWeight: "700" }}>{totalMemories}</div>
          <div style={{ fontSize: "1.1rem", opacity: 0.9 }}>Total Memories</div>
        </div>

        <div className="card" style={{ 
          background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)",
          color: "white",
          textAlign: "center",
          border: "none"
        }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>👁️</div>
          <div style={{ fontSize: "3rem", fontWeight: "700" }}>{totalViews}</div>
          <div style={{ fontSize: "1.1rem", opacity: 0.9 }}>Total Views</div>
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 className="card-title" style={{ marginBottom: "1.5rem" }}>
          🎭 Mood Distribution
        </h2>
        
        {moodDistribution && moodDistribution.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {moodDistribution.map((item) => {
              const percentage = totalMoments > 0 ? (item.count / totalMoments * 100).toFixed(1) : 0;
              const moodEmojis = {
                happy: "😊",
                sad: "😢",
                excited: "🤩",
                calm: "😌",
                neutral: "😐",
                anxious: "😰",
                grateful: "🙏",
                energetic: "⚡"
              };

              return (
                <div key={item._id}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    marginBottom: "0.5rem",
                    alignItems: "center"
                  }}>
                    <span style={{ 
                      fontWeight: "600", 
                      fontSize: "1.1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <span style={{ fontSize: "1.5rem" }}>
                        {moodEmojis[item._id] || "😊"}
                      </span>
                      <span style={{ textTransform: "capitalize" }}>{item._id}</span>
                    </span>
                    <span style={{ 
                      color: "#064e3b", 
                      fontWeight: "700",
                      fontSize: "1.1rem"
                    }}>
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div style={{ 
                    background: "#d1fae5", 
                    height: "30px", 
                    borderRadius: "15px",
                    overflow: "hidden"
                  }}>
                    <div style={{ 
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      height: "100%",
                      width: `${percentage}%`,
                      transition: "width 0.5s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingRight: "1rem",
                      color: "white",
                      fontWeight: "700",
                      fontSize: "0.875rem"
                    }}>
                      {percentage > 15 ? `${percentage}%` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ color: "var(--gray)" }}>No mood data available</p>
          </div>
        )}
      </div>

      {/* Tag Cloud */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 className="card-title" style={{ marginBottom: "1.5rem" }}>
          🏷️ Popular Tags
        </h2>
        
        {tagCloud && tagCloud.length > 0 ? (
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "1rem",
            justifyContent: "center",
            padding: "1rem"
          }}>
            {tagCloud.slice(0, 20).map((item, index) => {
              const maxCount = Math.max(...tagCloud.map(t => t.count));
              const size = 0.875 + (item.count / maxCount) * 1.5;
              const colors = [
                "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)",
                "linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)"
              ];
              
              return (
                <span
                  key={index}
                  style={{
                    background: colors[index % colors.length],
                    color: "white",
                    padding: `${size * 0.5}rem ${size * 0.75}rem`,
                    borderRadius: "25px",
                    fontSize: `${size}rem`,
                    fontWeight: "700",
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  #{item._id}
                  <span style={{ 
                    background: "rgba(255, 255, 255, 0.3)",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "15px",
                    fontSize: "0.75rem"
                  }}>
                    {item.count}
                  </span>
                </span>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ color: "var(--gray)" }}>No tags available</p>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: "1.5rem" }}>
          📅 Activity Timeline (Last 30 Days)
        </h2>
        
        {timeline && timeline.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {timeline.map((item) => {
              const maxCount = Math.max(...timeline.map(t => t.count), 1);
              const percentage = (item.count / maxCount * 100).toFixed(1);
              
              return (
                <div key={item._id}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    marginBottom: "0.5rem",
                    alignItems: "center"
                  }}>
                    <span style={{ fontWeight: "600", fontSize: "1rem" }}>
                      📅 {item._id}
                    </span>
                    <span style={{ 
                      background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                      color: "white",
                      padding: "0.375rem 0.875rem",
                      borderRadius: "20px",
                      fontWeight: "700",
                      fontSize: "0.875rem"
                    }}>
                      {item.count} moments
                    </span>
                  </div>
                  <div style={{ 
                    background: "#d1fae5", 
                    height: "25px", 
                    borderRadius: "12px",
                    overflow: "hidden"
                  }}>
                    <div style={{ 
                      background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)",
                      height: "100%",
                      width: `${percentage}%`,
                      transition: "width 0.5s ease"
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p style={{ color: "var(--gray)" }}>No timeline data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
