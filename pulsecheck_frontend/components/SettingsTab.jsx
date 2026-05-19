import { useState, useEffect } from "react";
import api from "@/providers/api";

export default function SettingsTab() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/settings/alert-email/")
      .then(res => {
        if (res.data.alert_email) setEmail(res.data.alert_email);
      }).catch(console.error);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post("/settings/alert-email/", { 
        alert_email: email
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000); // UI visual timeout
    } catch (error) {
      console.error(error);
      alert("Failed to save configuration.");
    } finally {
      setLoading(false);
    }
  };

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


        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "16px" }}>
          <button 
            disabled={loading}
            onClick={handleSave}
            style={{
              background: "transparent", border: "1px solid #00ff88",
              color: "#00ff88", borderRadius: "6px", padding: "9px 18px",
              fontSize: "11px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.06em", width: "max-content",
              opacity: loading ? 0.5 : 1
            }}>
              {loading ? "SAVING..." : "SAVE CONFIGURATION"}
          </button>
          
          {saved && (
            <span style={{ color: "#00ff88", fontSize: "11px", letterSpacing: "0.05em", fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              SAVED
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
