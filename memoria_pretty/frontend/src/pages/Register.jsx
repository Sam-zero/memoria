import { useState } from "react";
import { api } from "../api.js";
import { setToken } from "../auth.js";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const nav = useNavigate();
    const [name, setName] = useState("User");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const res = await api.post("/auth/register", { name, email, password });
            setToken(res.data.token);
            nav("/dashboard");
        } catch (e2) {
            setErr(e2?.response?.data?.message || "Register failed");
        }
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: 520 }}>
                <div className="pageHeader">
                    <h2 className="pageTitle">Create account</h2>
                    <span className="pill">JWT Auth</span>
                </div>

                <div className="card">
                    <div className="cardBody">
                        {err ? <div className="alert alertDanger" style={{ marginBottom: 10 }}>{err}</div> : null}

                        <form onSubmit={submit} className="grid" style={{ gap: 10 }}>
                            <div>
                                <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Name</div>
                                <input className="input" placeholder="User" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div>
                                <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Email</div>
                                <input className="input" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div>
                                <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Password</div>
                                <input className="input" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <button type="submit" className="btn btnPrimary">Create</button>
                        </form>

                        <p className="muted" style={{ marginTop: 12, marginBottom: 0 }}>
                            Already have account? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
