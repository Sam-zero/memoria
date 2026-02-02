import { useEffect, useState } from "react";
import { api } from "../api.js";
import { Link } from "react-router-dom";

export default function Memories() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [memories, setMemories] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await api.get(`/memories?sortBy=${sortBy}&order=${order}`);
      setMemories(res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Cannot load memories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [sortBy, order]);

  const create = async () => {
    setErr("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await api.post("/memories", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setTitle("");
      setDescription("");
      setCoverImage(null);
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Create memory failed");
    } finally {
      setLoading(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete memory?")) return;
    setErr("");
    setLoading(true);
    try {
      await api.delete(`/memories/${id}`);
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">📚 My Memories</h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              style={{ 
                width: "auto",
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                border: "2px solid #10b981",
                background: "white",
                color: "#064e3b",
                fontWeight: "600"
              }}
            >
              <option value="createdAt">📅 Date</option>
              <option value="title">📝 Title</option>
              <option value="updatedAt">🔄 Updated</option>
            </select>
            <select 
              value={order} 
              onChange={(e) => setOrder(e.target.value)} 
              style={{ 
                width: "auto",
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                border: "2px solid #10b981",
                background: "white",
                color: "#064e3b",
                fontWeight: "600"
              }}
            >
              <option value="desc">⬇️ Newest</option>
              <option value="asc">⬆️ Oldest</option>
            </select>
          </div>
        </div>

        {err && <div className="alert alert-error">{err}</div>}

        <div style={{ 
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
          padding: "2rem", 
          borderRadius: "16px", 
          marginBottom: "2rem",
          boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)"
        }}>
          <h2 style={{ color: "white", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
            ✨ Create New Memory
          </h2>
          
          <div className="form-group">
            <label className="form-label" style={{ color: "white" }}>📝 Title</label>
            <input
              type="text"
              placeholder="Summer 2026 Adventure..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ 
                background: "rgba(255, 255, 255, 0.95)",
                border: "2px solid rgba(255, 255, 255, 0.3)"
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: "white" }}>📖 Description</label>
            <textarea
              placeholder="Tell the story of this memory..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ 
                background: "rgba(255, 255, 255, 0.95)",
                border: "2px solid rgba(255, 255, 255, 0.3)"
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: "white" }}>📷 Cover Image</label>
            <div 
              className="file-upload" 
              style={{ 
                border: "3px dashed white", 
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)"
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                id="cover-upload"
              />
              <label htmlFor="cover-upload" style={{ cursor: "pointer", color: "white" }}>
                <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📸</div>
                <div style={{ fontWeight: "600" }}>
                  {coverImage ? coverImage.name : "Click to upload cover image"}
                </div>
              </label>
            </div>
          </div>

          <button 
            onClick={create} 
            disabled={loading} 
            style={{ 
              width: "100%",
              background: "white",
              color: "#10b981",
              fontSize: "1.1rem",
              padding: "1rem"
            }}
          >
            {loading ? <span className="loading" style={{ borderTopColor: "#10b981" }}></span> : "✨ Create Memory"}
          </button>
        </div>
      </div>

      {loading && <div style={{ textAlign: "center", padding: "2rem" }}>
        <div className="loading" style={{ margin: "0 auto", width: "40px", height: "40px", borderTopColor: "#10b981" }}></div>
      </div>}

      <div className="grid grid-2">
        {memories.map((m) => (
          <div 
            key={m._id} 
            className="card" 
            style={{ 
              padding: 0, 
              overflow: "hidden",
              border: "2px solid rgba(16, 185, 129, 0.2)",
              transition: "all 0.3s"
            }}
          >
            {m.coverImage && (
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img 
                  src={`http://localhost:5000${m.coverImage.url}`} 
                  alt={m.title}
                  style={{ 
                    width: "100%", 
                    height: "220px", 
                    objectFit: "cover"
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                }}>
                  📚 Memory
                </div>
              </div>
            )}
            
            <div style={{ padding: "1.5rem" }}>
              <h3 style={{ 
                fontSize: "1.4rem", 
                marginBottom: "0.75rem",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "700"
              }}>
                {m.title}
              </h3>
              
              <p style={{ 
                color: "var(--gray)", 
                marginBottom: "1rem",
                lineHeight: "1.6"
              }}>
                {m.description || "No description"}
              </p>
              
              <div style={{ 
                fontSize: "0.875rem", 
                color: "var(--gray)", 
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <span style={{ 
                  background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                  color: "white",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: "600"
                }}>
                  📅 {new Date(m.createdAt).toLocaleDateString()}
                </span>
                {m.moments && m.moments.length > 0 && (
                  <span style={{ 
                    background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)",
                    color: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "600"
                  }}>
                    📝 {m.moments.length} moments
                  </span>
                )}
              </div>
              
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Link 
                  to={`/memories/${m._id}`} 
                  style={{ 
                    flex: 1, 
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    padding: "0.875rem",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "all 0.3s"
                  }}
                >
                  👁️ View
                </Link>
                <button 
                  onClick={() => del(m._id)} 
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "white",
                    padding: "0.875rem 1.25rem",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s"
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && memories.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>📚</div>
          <p style={{ fontSize: "1.3rem", color: "var(--gray)", marginBottom: "1rem" }}>
            No memories yet. Create your first one above! 
          </p>
          <div style={{ 
            fontSize: "1rem", 
            color: "var(--primary)",
            fontWeight: "600"
          }}>
            ✨ Memories help you organize your moments into collections
          </div>
        </div>
      )}
    </div>
  );
}
