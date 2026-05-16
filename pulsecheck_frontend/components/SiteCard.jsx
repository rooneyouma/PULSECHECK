"use client";
import StatusDot from "./StatusDot";
import UptimeBar from "./UptimeChart";

export default function SiteRow({ site, onClick }) {
  return (
    <div className="mobile-site-row"
      onClick={() => onClick(site)}
      style={{
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr 1.5fr",
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid #1a1f2e",
        cursor: "pointer",
        transition: "background 0.15s",
        gap: "12px",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "#0d1117"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div className="mobile-site-name" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <StatusDot status={site.status} />
        <div>
          <div style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: "500", fontFamily: "'DM Mono', monospace" }}>{site.name}</div>
          <div style={{ color: "#4a5568", fontSize: "11px", marginTop: "2px", fontFamily: "'DM Mono', monospace" }}>{site.url}</div>
        </div>
      </div>

      <div style={{ fontFamily: "'DM Mono', monospace" }}>
        <span style={{
          fontSize: "13px",
          fontWeight: "600",
          color: site.uptime >= 99.9 ? "#00ff88" : site.uptime >= 98 ? "#f6c90e" : "#ff3b5c",
        }}>
          {site.uptime}%
        </span>
      </div>

      <div style={{ fontFamily: "'DM Mono', monospace" }}>
        <span style={{ fontSize: "13px", color: site.responseTime ? "#a0aec0" : "#ff3b5c" }}>
          {site.responseTime ? `${site.responseTime}ms` : "—"}
        </span>
      </div>

      <div style={{ fontFamily: "'DM Mono', monospace" }}>
        <span style={{ fontSize: "11px", color: "#4a5568" }}>
          {site.lastChecked ? new Date(site.lastChecked).toLocaleString("en-GB", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : "—"}
        </span>
      </div>

      <div className="mobile-history-bar">
        <UptimeBar history={site.history || site.ping_history || site.logs || []} />
      </div>
    </div>
  );
}