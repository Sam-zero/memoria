import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function MemoryDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [memory, setMemory] = useState(null);
  const [moments, setMoments] = useState([]);
  const [allMoments, setAllMoments] = useState([]);
  const [selectedMoment, setSelectedMoment] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const [memRes, momRes] = await Promise.all([
        api.get(`/memories/${id}`),
        api.get("/moments")
      ]);
      
      setMemory(memRes.data);
      setAllMoments(momRes.data.items || momRes.data);

      const momentIds = memRes.data.moments.map(m => m.momentId);
      const momentsData = await Promise.all(
        momentIds.map(mid => api.get(`/moments/${mid}`).catch(() => null))
      );
      setMoments(momentsData.filter(Boolean).map(r => r.data));
    } catch (e) {
      setErr(e?.response?.data?.message || "Cannot load memory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const addMoment = async () => {
    if (!selectedMoment) return;
    setErr("");
    try {
      await api.patch(`/memories/${id}/add-moment`, { momentId: selectedMoment });
      setSelectedMoment("");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Cannot add moment");
    }
  };

  const removeMoment = async (momentId) => {
    if (!confirm("Remove this moment from memory?")) return;
    setErr("");
    try {
      await api.patch(`/memories/${id}/remove-moment`, { momentId });
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || "Cannot remove moment");
    }
  };

  const deleteMemory = async () => {
    if (!confirm("Delete entire memory?")) return;
    try {
      await api.delete(`/memories/${id}`);
      nav("/memories");
    } catch (e) {
      setErr("Failed to delete memory");
    }
  };

  const openLightbox = (imageUrl) => {
    setLightboxImage(imageUrl);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage("");
  };

  if (loading && !memory) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div className="loading" style={{ margin: "0 auto", width: "40px", height: "40px", borderTopColor: "#10b981" }}></div>
          <p style={{ marginTop: "1rem" }}>Loading memory...</p>
        </div>
      </div>
    );
  }

  if (err && !memory) {
    return (
      <div className="container">
        <div className="alert alert-error">{err}</div>
        <Link to="/memories" className="btn">← Back to Memories</Link>
      </div>
    );
  }

  if (!memory) return null;

  const availableMoments = allMoments.filter(
    m => !memory.moments.some(mm => mm.momentId === m._id)
  );

  return (
    <div className="container" style={{ maxWidth: "1000px" }}>
      {/* Header Card */}
      <div className="card" style={{ 
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        marginBottom: "2rem",
        padding: "2.5rem",
        border: "none"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "white" }}>
              {memory.title}
            </h1>
            {memory.description && (
              <p style={{ 
                fontSize: "1.15rem", 
                opacity: 0.95, 
                lineHeight: "1.7",
                color: "white",
                marginBottom: "1rem"
              }}>
                {memory.description}
              </p>
            )}
            <div style={{ 
              display: "flex", 
              gap: "1rem", 
              fontSize: "0.95rem",
              opacity: 0.9
            }}>
              <span>📅 {new Date(memory.createdAt).toLocaleDateString()}</span>
              <span>📝 {moments.length} moments</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button 
              onClick={deleteMemory}
              style={{
                background: "rgba(239, 68, 68, 0.9)",
                color: "white",
                padding: "0.75rem 1.25rem",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {memory.coverImage && (
        <div 
          className="card" 
          style={{ 
            padding: 0, 
            overflow: "hidden",
            marginBottom: "2rem",
            cursor: "pointer"
          }}
          onClick={() => openLightbox(`http://localhost:5000${memory.coverImage.url}`)}
        >
          <img 
            src={`http://localhost:5000${memory.coverImage.url}`} 
            alt={memory.title}
            style={{ 
              width: "100%", 
              height: "400px", 
              objectFit: "cover",
              transition: "transform 0.3s"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          />
          <div style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "rgba(16, 185, 129, 0.9)",
            color: "white",
            padding: "0.75rem 1.25rem",
            borderRadius: "25px",
            fontSize: "0.875rem",
            fontWeight: "600",
            backdropFilter: "blur(10px)"
          }}>
            🔍 Click to view full size
          </div>
        </div>
      )}

      {err && <div className="alert alert-error">{err}</div>}

      {/* Add Moment Section */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 className="card-title" style={{ marginBottom: "1.5rem" }}>
          ➕ Add Moment to Memory
        </h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <select
            value={selectedMoment}
            onChange={(e) => setSelectedMoment(e.target.value)}
            style={{ 
              flex: 1,
              padding: "0.875rem",
              borderRadius: "12px",
              border: "2px solid #10b981",
              fontSize: "1rem"
            }}
          >
            <option value="">Select a moment...</option>
            {availableMoments.map(m => (
              <option key={m._id} value={m._id}>
                {m.text.substring(0, 60)}{m.text.length > 60 ? "..." : ""}
              </option>
            ))}
          </select>
          <button 
            onClick={addMoment} 
            disabled={!selectedMoment}
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              padding: "0.875rem 1.75rem",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem"
            }}
          >
            ➕ Add
          </button>
        </div>
      </div>

      {/* Moments List */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: "1.5rem" }}>
          📝 Moments in this Memory ({moments.length})
        </h2>

        {moments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📝</div>
            <p style={{ fontSize: "1.2rem", color: "var(--gray)" }}>
              No moments yet. Add your first moment above!
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {moments.map((m) => (
              <div 
                key={m._id}
                style={{
                  padding: "1.5rem",
                  background: "var(--light-gray)",
                  borderRadius: "16px",
                  border: "2px solid rgba(16, 185, 129, 0.2)",
                  transition: "all 0.3s"
                }}
              >
                {/* Moment Media */}
                {m.media && m.media.length > 0 && (
                  <div style={{ 
                    display: "grid",
                    gridTemplateColumns: m.media.length === 1 ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    marginBottom: "1.5rem"
                  }}>
                    {m.media.map((media, index) => (
                      <div 
                        key={index}
                        style={{
                          borderRadius: "12px",
                          overflow: "hidden",
                          cursor: "pointer",
                          position: "relative",
                          aspectRatio: m.media.length === 1 ? "auto" : "1"
                        }}
                        onClick={() => media.type === "image" && openLightbox(`http://localhost:5000${media.url}`)}
                      >
                        {media.type === "image" ? (
                          <>
                            <img 
                              src={`http://localhost:5000${media.url}`} 
                              alt="Moment"
                              style={{ 
                                width: "100%", 
                                height: m.media.length === 1 ? "auto" : "100%",
                                maxHeight: m.media.length === 1 ? "500px" : "none",
                                objectFit: "cover",
                                transition: "transform 0.3s"
                              }}
                              onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                            />
                            <div style={{
                              position: "absolute",
                              top: "0.5rem",
                              right: "0.5rem",
                              background: "rgba(16, 185, 129, 0.8)",
                              color: "white",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "20px",
                              fontSize: "0.75rem",
                              fontWeight: "600"
                            }}>
                              🔍 Click
                            </div>
                          </>
                        ) : (
                          <video 
                            src={`http://localhost:5000${media.url}`}
                            controls
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Moment Text */}
                <p style={{ 
                  fontSize: "1.1rem", 
                  lineHeight: "1.7",
                  color: "var(--dark)",
                  marginBottom: "1rem"
                }}>
                  {m.text}
                </p>

                {/* Moment Metadata */}
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginBottom: "1rem"
                }}>
                  <span style={{
                    background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.875rem",
                    fontWeight: "600"
                  }}>
                    😊 {m.mood}
                  </span>
                  {m.tags.map((tag, i) => (
                    <span 
                      key={i}
                      style={{
                        background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)",
                        color: "white",
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        fontSize: "0.875rem",
                        fontWeight: "600"
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                  <span style={{
                    background: "var(--light-gray)",
                    color: "#064e3b",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    border: "2px solid rgba(16, 185, 129, 0.3)"
                  }}>
                    👁️ {m.views} views
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <Link 
                    to={`/moments/${m._id}`}
                    style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "12px",
                      textDecoration: "none",
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    👁️ View Full
                  </Link>
                  <button 
                    onClick={() => removeMoment(m._id)}
                    style={{
                      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "white",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "12px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    ➖ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link 
        to="/memories" 
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginTop: "2rem",
          padding: "1rem 2rem",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          textDecoration: "none",
          borderRadius: "12px",
          fontWeight: "600",
          fontSize: "1rem"
        }}
      >
        ← Back to Memories
      </Link>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          onClick={closeLightbox}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "zoom-out",
            padding: "2rem"
          }}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              background: "rgba(16, 185, 129, 0.9)",
              color: "white",
              border: "none",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              fontSize: "2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "300",
              zIndex: 10000
            }}
          >
            ×
          </button>
          <img 
            src={lightboxImage}
            alt="Full size"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(16, 185, 129, 0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
