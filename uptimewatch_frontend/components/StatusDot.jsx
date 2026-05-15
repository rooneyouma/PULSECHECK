"use client";

export default function StatusDot({ status }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <span style={{
        width: "8px", height: "8px", borderRadius: "50%",
        background: status === "up" ? "#00ff88" : "#ff3b5c",
        display: "inline-block",
        boxShadow: status === "up" ? "0 0 6px #00ff88" : "0 0 6px #ff3b5c",
      }} />
    </span>
  );
}