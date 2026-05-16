"use client";

export default function UptimeBar({ history }) {
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div style={{ fontSize: "10px", color: "#2d3748", letterSpacing: "0.05em" }}>
        NO RECENT PING DATA
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      {history.map((val, i) => (
        <div
          key={i}
          style={{
            width: "6px",
            height: "20px",
            borderRadius: "2px",
            background: val === 1 ? "#00ff88" : "#ff3b5c",
            opacity: val === 1 ? 0.85 : 1,
            transition: "opacity 0.2s",
          }}
        />
      ))}
    </div>
  );
}