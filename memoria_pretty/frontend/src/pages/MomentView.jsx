import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function MomentView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [moment, setMoment] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setErr("");
      setLoading(true);
      try {
        await api.post(`/moments/${id}/view`);
        const res = await api.get(`/moments/${id}`);
        setMoment(res.data);
      } catch (e) {
        setErr(e?.response?.data?.message || "Cannot load moment");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const deleteMoment = async () => {
    if (!confirm("Delete this moment?")) return;
    try {
      await api.delete(`/moments/${id}`);
      nav("/dashboard");
    } catch (e) {
      setErr("Failed to delete moment");
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div className="loading" style={{ margin: "0 auto" }}></div>
          <p style={{ marginTop: "1rem" }}>Loading moment...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="container">
        <div className="alert alert-error">{err}</div>
        <Link to="/dashboard" className="btn">← Back to Dashboard</Link>
      </div>
    );
  }

  if (!moment) return null;

  return (
    <div className="container" style={{ maxWidth: "900px" }}>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">📝 Moment Details</h1>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link to={`/moments/${id}/edit`} className="btn">
              ✏️ Edit
            </Link>
            <button onClick={deleteMoment} className="btn-danger">
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Media Gallery */}
        {moment.media && moment.media.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--dark)" }}>
              📷 Media ({moment.media.length})
            </h3>
            <div className="media-grid">
              {moment.media.map((media, index) => (
                <div key={index} className="media-item" style={{ aspectRatio: "auto" }}>
                  {media.type === "image" ? (
                    <img 
                      src={`http://localhost:5000${media.url}`} 
                      alt={`Media ${index + 1}`}
                      style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                    />
                  ) : (
                    <video 
                      src={`http://localhost:5000${media.url}`}
                      controls
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Text Content */}
        <div style={{ 
          padding: "1.5rem", 
          background: "var(--light-gray)", 
          borderRadius: "12px",
          marginBottom: "1.5rem"
        }}>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--dark)" }}>
            {moment.text}
          </p>
        </div>

        {/* Metadata Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "1rem",
          marginBottom: "1.5rem"
        }}>
          <div style={{ 
            padding: "1rem", 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "12px",
            color: "white"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>😊</div>
            <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>Mood</div>
            <div style={{ fontSize: "1.25rem", fontWeight: "700", textTransform: "capitalize" }}>
              {moment.mood}
            </div>
          </div>

          <div style={{ 
            padding: "1rem", 
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            borderRadius: "12px",
            color: "white"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👁️</div>
            <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>Views</div>
            <div style={{ fontSize: "1.25rem", fontWeight: "700" }}>
              {moment.views}
            </div>
          </div>

          <div style={{ 
            padding: "1rem", 
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            borderRadius: "12px",
            color: "white"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📅</div>
            <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>Created</div>
            <div style={{ fontSize: "1.25rem", fontWeight: "700" }}>
              {new Date(moment.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Tags */}
        {moment.tags && moment.tags.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ marginBottom: "0.75rem", color: "var(--dark)" }}>🏷️ Tags</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {moment.tags.map((tag, i) => (
                <span key={i} className="badge badge-tag" style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <Link to="/dashboard" className="btn-outline" style={{ width: "100%", justifyContent: "center" }}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
