"use client";

export default function UptimeBar({ history }) {
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