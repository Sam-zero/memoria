import { useState, useEffect } from "react";
import { api } from "../api.js";
import { useNavigate, useParams } from "react-router-dom";

export default function MomentForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const isEdit = !!id;

  const [text, setText] = useState("");
  const [mood, setMood] = useState("neutral");
  const [tags, setTags] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const moods = [
    { value: "happy", emoji: "😊", color: "#10b981" },
    { value: "sad", emoji: "😢", color: "#6366f1" },
    { value: "excited", emoji: "🤩", color: "#f59e0b" },
    { value: "calm", emoji: "😌", color: "#8b5cf6" },
    { value: "neutral", emoji: "😐", color: "#6b7280" },
    { value: "anxious", emoji: "😰", color: "#ef4444" },
    { value: "grateful", emoji: "🙏", color: "#ec4899" },
    { value: "energetic", emoji: "⚡", color: "#14b8a6" }
  ];

  useEffect(() => {
    if (isEdit) {
      (async () => {
        try {
          const res = await api.get(`/moments/${id}`);
          setText(res.data.text);
          setMood(res.data.mood);
          setTags(res.data.tags.join(", "));
        } catch (e) {
          setErr("Cannot load moment");
        }
      })();
    }
  }, [id, isEdit]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    // Проверка: максимум 5 файлов
    const totalFiles = mediaFiles.length + newFiles.length;
    if (totalFiles > 5) {
      setErr(`You can only upload maximum 5 files. Currently selected: ${mediaFiles.length}`);
      return;
    }

    setMediaFiles(prev => [...prev, ...newFiles]);

    const newUrls = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);

    setErr("");
  };

  const removeFile = (index) => {

    const newFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(newFiles);

    URL.revokeObjectURL(previewUrls[index]);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
  };

  const save = async () => {
    setErr("");
    if (!text.trim()) {
      setErr("Please write something!");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await api.patch(`/moments/${id}`, {
          text,
          mood,
          tags: tags.split(",").map(t => t.trim()).filter(Boolean)
        });
      } else {
        // Create new moment with media
        const formData = new FormData();
        formData.append("text", text);
        formData.append("mood", mood);
        formData.append("tags", tags);
        
        mediaFiles.forEach(file => {
          formData.append("media", file);
        });

        await api.post("/moments", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      nav("/dashboard");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save moment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            {isEdit ? "✏️ Edit Moment" : "✨ Create New Moment"}
          </h1>
        </div>

        {err && <div className="alert alert-error">{err}</div>}

        {/* Text Input */}
        <div className="form-group">
          <label className="form-label">📝 What's on your mind?</label>
          <textarea
            placeholder="Write about your day, thoughts, feelings..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ minHeight: "150px" }}
          />
        </div>

        {/* Mood Selection */}
        <div className="form-group">
          <label className="form-label">🎭 How are you feeling?</label>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", 
            gap: "0.75rem",
            marginTop: "0.5rem"
          }}>
            {moods.map(m => (
              <div
                key={m.value}
                onClick={() => setMood(m.value)}
                style={{
                  padding: "1rem",
                  borderRadius: "12px",
                  border: `3px solid ${mood === m.value ? m.color : "#e5e7eb"}`,
                  background: mood === m.value ? `${m.color}15` : "white",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                  transform: mood === m.value ? "scale(1.05)" : "scale(1)"
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{m.emoji}</div>
                <div style={{ 
                  fontSize: "0.875rem", 
                  fontWeight: mood === m.value ? "700" : "500",
                  color: mood === m.value ? m.color : "#6b7280",
                  textTransform: "capitalize"
                }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags Input */}
        <div className="form-group">
          <label className="form-label">🏷️ Tags (comma-separated)</label>
          <input
            type="text"
            placeholder="work, friends, travel, achievement..."
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {tags.split(",").map(t => t.trim()).filter(Boolean).map((tag, i) => (
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
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Media Upload (only for new moments) */}
        {!isEdit && (
          <div className="form-group">
            <label className="form-label">
              📷 Add Photos or Videos ({mediaFiles.length}/5)
            </label>
            
            {/* Upload Button - Always visible if under 5 files */}
            {mediaFiles.length < 5 && (
              <div 
                className="file-upload" 
                style={{
                  border: "3px dashed #10b981",
                  background: "rgba(16, 185, 129, 0.05)"
                }}
              >
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  id="media-upload"
                />
                <label htmlFor="media-upload" style={{ cursor: "pointer" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📸</div>
                  <div style={{ fontWeight: "600", color: "#064e3b" }}>
                    {mediaFiles.length === 0 
                      ? "Click to upload images or videos" 
                      : `Click to add more (${5 - mediaFiles.length} slots remaining)`
                    }
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--gray)", marginTop: "0.25rem" }}>
                    Select multiple files at once or add one by one (max 5 files, 50MB each)
                  </div>
                </label>
              </div>
            )}

            {/* File limit reached message */}
            {mediaFiles.length >= 5 && (
              <div style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                color: "white",
                padding: "1rem",
                borderRadius: "12px",
                textAlign: "center",
                fontWeight: "600",
                marginBottom: "1rem"
              }}>
                ✅ Maximum 5 files selected! Remove some to add different ones.
              </div>
            )}

            {/* Media Preview Grid */}
            {previewUrls.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
                marginTop: "1rem"
              }}>
                {previewUrls.map((url, index) => (
                  <div 
                    key={index} 
                    style={{
                      position: "relative",
                      borderRadius: "12px",
                      overflow: "hidden",
                      aspectRatio: "1",
                      background: "#f0fdf4",
                      border: "2px solid #10b981"
                    }}
                  >
                    {mediaFiles[index].type.startsWith("image/") ? (
                      <img 
                        src={url} 
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <video 
                        src={url}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    )}
                    
                    {/* File info badge */}
                    <div style={{
                      position: "absolute",
                      bottom: "0.5rem",
                      left: "0.5rem",
                      background: "rgba(16, 185, 129, 0.9)",
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "8px",
                      fontSize: "0.7rem",
                      fontWeight: "600"
                    }}>
                      {mediaFiles[index].type.startsWith("image/") ? "📷" : "🎥"} {(mediaFiles[index].size / 1024 / 1024).toFixed(1)}MB
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFile(index)}
                      style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        background: "rgba(239, 68, 68, 0.9)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                      }}
                    >
                      ×
                    </button>

                    {/* File number */}
                    <div style={{
                      position: "absolute",
                      top: "0.5rem",
                      left: "0.5rem",
                      background: "rgba(16, 185, 129, 0.9)",
                      color: "white",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.875rem",
                      fontWeight: "700"
                    }}>
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button 
            onClick={save} 
            disabled={loading}
            style={{ 
              flex: 1,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              padding: "1rem"
            }}
          >
            {loading ? (
              <span className="loading" style={{ borderTopColor: "white" }}></span>
            ) : (
              isEdit ? "💾 Save Changes" : "✨ Create Moment"
            )}
          </button>
          <button 
            onClick={() => nav("/dashboard")} 
            className="btn-outline"
            style={{ flex: 1, padding: "1rem" }}
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
