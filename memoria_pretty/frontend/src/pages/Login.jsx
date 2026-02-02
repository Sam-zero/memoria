import { useState } from "react";
import { api } from "../api.js";
import { setToken } from "../auth.js";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const res = await api.post("/auth/login", { email, password });
            setToken(res.data.token);
            nav("/dashboard");
        } catch (e2) {
            setErr(e2?.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: 520 }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <img 
                    src="/logo.png" 
                    alt="Memoria" 
                    style={{ 
                    width: "80px", 
                    height: "80px",
                    borderRadius: "16px",
                    boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
                    marginBottom: "1rem"
                    }} 
                />
                <h1 style={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: "0.5rem"
                }}>
                    Memoria
                </h1>
                <p style={{ color: "#6b7280", fontSize: "1.1rem" }}>
                    Welcome back! Sign in to your account
                </p>
                </div>

                <div className="card">
                    <div className="cardBody">
                        {err ? <div className="alert alertDanger" style={{ marginBottom: 10 }}>{err}</div> : null}

                        <form onSubmit={submit} className="grid" style={{ gap: 10 }}>
                            <div>
                                <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Email</div>
                                <input className="input" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div>
                                <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Password</div>
                                <input className="input" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <button type="submit" className="btn btnPrimary">Login</button>
                        </form>

                        <p className="muted" style={{ marginTop: 12, marginBottom: 0 }}>
                            No account? <Link to="/register">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
