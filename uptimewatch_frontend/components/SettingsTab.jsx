import { useState } from "react";

export default function SettingsTab() {
  const [email, setEmail] = useState("admin@pulsecheck.com");

  return (
    <div style={{
      background: "#0a0e1a", border: "1px solid #1a1f2e",
      borderRadius: "10px", padding: "32px", color: "#e2e8f0"
    }}>
      <h2 style={{ fontSize: "18px", fontFamily: "'Syne', sans-serif", marginBottom: "24px" }}>CORE CONFIGURATION</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        <div style={{ paddingBottom: "16px", borderBottom: "1px solid #1a1f2e" }}>
          <label style={{ display: "block", fontSize: "10px", color: "#4a5568", letterSpacing: "0.1em", marginBottom: "8px" }}>ALERT NOTIFICATION EMAIL</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: "100%", maxWidth: "400px", background: "transparent", border: "1px solid #1a1f2e", 
              color: "#e2e8f0", padding: "12px", borderRadius: "6px", outline: "none", 
              fontSize: "12px", fontFamily: "'DM Mono', monospace" 
            }} 
          />
        </div>

        <button style={{
            background: "transparent", border: "1px solid #00ff88",
            color: "#00ff88", borderRadius: "6px", padding: "9px 18px",
            fontSize: "11px", cursor: "pointer", fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.06em", width: "max-content", marginTop: "16px"
          }}>
            SAVE CONFIGURATION
        </button>
      </div>
    </div>
  );
}
