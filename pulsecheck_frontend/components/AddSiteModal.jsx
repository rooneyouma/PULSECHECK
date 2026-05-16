"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/providers/api";

export default function AddSiteModal({ onClose, onAdd }) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (newSite) => {
      const { data } = await api.post("/sites/", newSite);
      return data;
    },

    onSuccess: () => {
      // Use exact:false so it matches all paginated keys like "/sites/?page=1"
      queryClient.invalidateQueries({ queryKey: ["/sites/"], exact: false });
      if (onAdd) onAdd(); // Also trigger parent's refetch for immediate update
      onClose();
    },
    onError: (err) => {
      const backendError = err.response?.data?.detail || err.response?.data?.message;
      setErrorMsg(backendError || "Failed to register endpoint with core engine.");
    },
  });

  const handleCommit = () => {
    if (!name.trim() || !url.trim()) {
      setErrorMsg("Both fields are required.");
      return;
    }
    setErrorMsg("");
    mutate({ name, url });
  };

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
          <button onClick={onClose} disabled={isPending} style={{ background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>

        {errorMsg && (
          <div style={{ background: "rgba(255, 59, 92, 0.08)", border: "1px solid rgba(255,59,92,0.2)", borderRadius: "6px", padding: "10px", fontSize: "11px", color: "#ff3b5c", marginBottom: "16px", fontFamily: "'DM Mono', monospace" }}>
            ERROR: {errorMsg}
          </div>
        )}

        {["Site Name", "URL"].map((label, i) => (
          <div key={i} style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "#4a5568", fontSize: "11px", marginBottom: "6px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>
              {label.toUpperCase()}
            </label>
            <input
              placeholder={i === 0 ? "My Site" : "https://api.example.com"}
              value={i === 0 ? name : url}
              onChange={e => i === 0 ? setName(e.target.value) : setUrl(e.target.value)}
              disabled={isPending}
              style={{
                width: "100%", background: "#0d1117", border: "1px solid #1a1f2e",
                borderRadius: "6px", padding: "10px 12px", color: "#e2e8f0",
                fontSize: "13px", fontFamily: "'DM Mono', monospace", outline: "none",
                boxSizing: "border-box",
                opacity: isPending ? 0.6 : 1,
              }}
            />
          </div>
        ))}

        <button
          onClick={handleCommit}
          disabled={isPending}
          style={{
            width: "100%", background: isPending ? "#1a1f2e" : "#00ff88", 
            color: isPending ? "#4a5568" : "#0a0e1a",
            border: "none", borderRadius: "6px", padding: "11px",
            fontSize: "12px", fontWeight: "700", cursor: isPending ? "not-allowed" : "pointer",
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em",
            marginTop: "8px",
          }}
        >
          {isPending ? "PROVISIONING..." : "START MONITORING"}
        </button>
      </div>
    </div>
  );
}