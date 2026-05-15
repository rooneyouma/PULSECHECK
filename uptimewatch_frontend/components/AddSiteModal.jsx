"use client";
import { useState } from "react";

export default function AddSiteModal({ onClose, onAdd }) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "#0a0e1a", border: "1px solid #1a1f2e",
        borderRadius: "12px", padding: "28px", width: "420px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "600", fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>
            ADD MONITOR
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>

        {["Site Name", "URL"].map((label, i) => (
          <div key={i} style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#4a5568", fontSize: "11px", marginBottom: "6px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>
              {label.toUpperCase()}
            </label>
            <input
              placeholder={i === 0 ? "Production API" : "https://api.example.com"}
              value={i === 0 ? name : url}
              onChange={e => i === 0 ? setName(e.target.value) : setUrl(e.target.value)}
              style={{
                width: "100%", background: "#0d1117", border: "1px solid #1a1f2e",
                borderRadius: "6px", padding: "10px 12px", color: "#e2e8f0",
                fontSize: "13px", fontFamily: "'DM Mono', monospace", outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}

        <button
          onClick={() => { onAdd({ name, url }); onClose(); }}
          style={{
            width: "100%", background: "#00ff88", color: "#0a0e1a",
            border: "none", borderRadius: "6px", padding: "11px",
            fontSize: "12px", fontWeight: "700", cursor: "pointer",
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em",
            marginTop: "8px",
          }}
        >
          START MONITORING
        </button>
      </div>
    </div>
  );
}