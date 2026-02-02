import { useState } from "react";
import { api } from "../api.js";
import { Link } from "react-router-dom";

export default function Settings() {
    const [msg, setMsg] = useState("");

    const ping = async () => {
        setMsg("");
        try {
            const res = await api.get("/health");
            setMsg(res.data?.message || "OK");
        } catch {
            setMsg("Backend not reachable (check server + CORS + port)");
        }
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: 900 }}>
                <div className="pageHeader">
                    <h2 className="pageTitle">Settings</h2>
                    <Link to="/dashboard" className="btn btnSecondary">Back</Link>
                </div>

                <div className="card">
                    <div className="cardHeader">
                        <h3 className="cardTitle">Health check</h3>
                        <span className="pill">/api/health</span>
                    </div>
                    <div className="cardBody">
                        <div className="row">
                            <button onClick={ping} className="btn btnPrimary">Ping backend</button>
                            {msg ? <span className="pill">{msg}</span> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
