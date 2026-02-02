import { useState } from "react";
import { api } from "../api.js";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState("");
  const [tag, setTag] = useState("");
  const [results, setResults] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const moods = [
    { value: "", label: "All Moods", emoji: "🌈", color: "#10b981" },
    { value: "happy", label: "Happy", emoji: "😊", color: "#34d399" },
    { value: "sad", label: "Sad", emoji: "😢", color: "#6ee7b7" },
    { value: "excited", label: "Excited", emoji: "🤩", color: "#fbbf24" },
    { value: "calm", label: "Calm", emoji: "😌", color: "#a7f3d0" },
    { value: "neutral", label: "Neutral", emoji: "😐", color: "#6b7280" },
    { value: "anxious", label: "Anxious", emoji: "😰", color: "#f59e0b" },
    { value: "grateful", label: "Grateful", emoji: "🙏", color: "#059669" },
    { value: "energetic", label: "Energetic", emoji: "⚡", color: "#10b981" }
  ];

  const search = async () => {
    setErr("");
    setLoading(true);
    setSearched(true);
    
    try {
      let url = `/moments?q=${query}`;
      if (mood) url += `&mood=${mood}`;
      if (tag) url += `&tag=${tag}`;

      const res = await api.get(url);
      setResults(res.data.items || res.data);
    } catch (e) {
      setErr(e?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">🔍 Search Moments</h1>
          <div style={{
            background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            fontSize: "0.875rem",
            fontWeight: "600"
          }}>
            {results.length} results
          </div>
        </div>

        {err && <div className="alert alert-error">{err}</div>}

        {/* Search Filters */}
        <div style={{ 
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
          padding: "2rem", 
          borderRadius: "16px",
          marginBottom: "2rem",
          boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)"
        }}>
          {/* Text Search */}
          <div className="form-group">
            <label className="form-label" style={{ color: "white" }}>🔎 Search Text</label>
            <input
              type="text"
              placeholder="Search in your moments..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ 
                background: "rgba(255, 255, 255, 0.95)",
                border: "2px solid rgba(255, 255, 255, 0.3)"
              }}
            />
          </div>

          {/* Mood Filter */}
          <div className="form-group">
            <label className="form-label" style={{ color: "white" }}>🎭 Filter by Mood</label>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", 
              gap: "0.75rem"
            }}>
              {moods.map(m => (
                <div
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  style={{
                    padding: "0.875rem",
                    borderRadius: "12px",
                    background: mood === m.value ? "white" : "rgba(255, 255, 255, 0.15)",
                    color: mood === m.value ? m.color : "white",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.3s",
                    fontWeight: mood === m.value ? "700" : "500",
                    border: `2px solid ${mood === m.value ? "white" : "transparent"}`,
                    backdropFilter: "blur(10px)",
                    transform: mood === m.value ? "scale(1.05)" : "scale(1)"
                  }}
                >
                  <div style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{m.emoji}</div>
                  <div style={{ fontSize: "0.75rem" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tag Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ color: "white" }}>🏷️ Filter by Tag</label>
            <input
              type="text"
              placeholder="e.g. work, travel, friends..."
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ 
                marginBottom: "1.5rem",
                background: "rgba(255, 255, 255, 0.95)",
                border: "2px solid rgba(255, 255, 255, 0.3)"
              }}
            />
          </div>

          {/* Search Button */}
          <button 
            onClick={search} 
            disabled={loading}
            style={{ 
              width: "100%", 
              background: "white", 
              color: "#10b981", 
              fontSize: "1.1rem",
              padding: "1rem",
              fontWeight: "700"
            }}
          >
            {loading ? <span className="loading" style={{ borderTopColor: "#10b981" }}></span> : "🔍 Search Moments"}
          </button>
        </div>

        {/* Active Filters Display */}
        {(query || mood || tag) && (
          <div style={{ marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontWeight: "600", color: "var(--primary)" }}>Active filters:</span>
            {query && (
              <span style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontSize: "0.875rem",
                fontWeight: "600"
              }}>
                📝 Text: "{query}"
              </span>
            )}
            {mood && (
              <span style={{
                background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontSize: "0.875rem",
                fontWeight: "600"
              }}>
                😊 Mood: {mood}
              </span>
            )}
            {tag && (
              <span style={{
                background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontSize: "0.875rem",
                fontWeight: "600"
              }}>
                🏷️ Tag: {tag}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div className="loading" style={{ margin: "0 auto", width: "50px", height: "50px", borderTopColor: "#10b981" }}></div>
          <p style={{ marginTop: "1rem", color: "var(--primary)", fontWeight: "600" }}>
            Searching through your memories...
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && searched && (
        <div>
          <div style={{ 
            marginBottom: "1.5rem", 
            padding: "1rem",
            background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
            borderRadius: "12px",
            fontWeight: "700",
            fontSize: "1.1rem",
            color: "#064e3b",
            textAlign: "center"
          }}>
            ✨ Found {results.length} moment{results.length !== 1 ? "s" : ""}
          </div>

          <div className="grid grid-2">
            {results.map((m) => (
              <div 
                key={m._id} 
                className="card" 
                style={{ 
                  display: "flex", 
                  flexDirection: "column",
                  border: "2px solid rgba(16, 185, 129, 0.2)"
                }}
              >
                {/* Media Preview */}
                {m.media && m.media.length > 0 && (
                  <div className="media-grid" style={{ marginBottom: "1rem" }}>
                    {m.media.slice(0, 3).map((media, index) => (
                      <div key={index} className="media-item">
                        {media.type === "image" ? (
                          <img 
                            src={`http://localhost:5000${media.url}`} 
                            alt="Moment media"
                          />
                        ) : (
                          <video 
                            src={`http://localhost:5000${media.url}`}
                            style={{ width: "100%", height: "100%" }}
                          />
                        )}
                      </div>
                    ))}
                    {m.media.length > 3 && (
                      <div className="media-item" style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "#064e3b"
                      }}>
                        +{m.media.length - 3}
                      </div>
                    )}
                  </div>
                )}

                {/* Text Content */}
                <p style={{ 
                  fontSize: "1rem", 
                  lineHeight: "1.6",
                  marginBottom: "1rem",
                  color: "var(--dark)"
                }}>
                  {m.text.length > 150 ? m.text.substring(0, 150) + "..." : m.text}
                </p>

                {/* Metadata */}
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: "0.5rem",
                  marginBottom: "1rem"
                }}>
                  <span style={{
                    background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
                    color: "white",
                    padding: "0.5rem 0.875rem",
                    borderRadius: "20px",
                    fontSize: "0.875rem",
                    fontWeight: "600"
                  }}>
                    😊 {m.mood}
                  </span>
                  {m.tags.slice(0, 3).map((t, i) => (
                    <span 
                      key={i}
                      style={{
                        background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)",
                        color: "white",
                        padding: "0.5rem 0.875rem",
                        borderRadius: "20px",
                        fontSize: "0.875rem",
                        fontWeight: "600"
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                  {m.tags.length > 3 && (
                    <span style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      padding: "0.5rem 0.875rem",
                      borderRadius: "20px",
                      fontSize: "0.875rem",
                      fontWeight: "600"
                    }}>
                      +{m.tags.length - 3}
                    </span>
                  )}
                </div>

                <div style={{ 
                  fontSize: "0.875rem", 
                  color: "var(--gray)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "1rem",
                  borderTop: "2px solid var(--light-gray)",
                  marginTop: "auto"
                }}>
                  <span style={{
                    background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                    color: "#064e3b",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "15px",
                    fontWeight: "600"
                  }}>
                    👁️ {m.views} views
                  </span>
                  <span style={{ fontWeight: "600", color: "#064e3b" }}>
                    📅 {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Action Button */}
                <Link 
                  to={`/moments/${m._id}`} 
                  style={{ 
                    marginTop: "1rem", 
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
                  👁️ View Details
                </Link>
              </div>
            ))}
          </div>

          {/* No Results */}
          {results.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🔍</div>
              <h3 style={{ 
                marginBottom: "0.5rem", 
                color: "#064e3b",
                fontSize: "1.5rem"
              }}>
                No moments found
              </h3>
              <p style={{ color: "var(--gray)", fontSize: "1.1rem" }}>
                Try adjusting your search filters or create a new moment!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!searched && !loading && (
        <div className="card" style={{ textAlign: "center", padding: "4rem" }}>
          <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🔎</div>
          <h3 style={{ 
            marginBottom: "0.75rem", 
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "1.75rem",
            fontWeight: "700"
          }}>
            Start Your Search Journey
          </h3>
          <p style={{ color: "var(--gray)", fontSize: "1.1rem" }}>
            Use the filters above to find your precious moments 🌿
          </p>
        </div>
      )}
    </div>
  );
}
