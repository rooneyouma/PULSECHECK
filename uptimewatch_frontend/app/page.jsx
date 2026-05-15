"use client";
import { useState, useEffect } from "react";
import SiteRow from "@/components/SiteCard";
import AddSiteModal from "@/components/AddSiteModal";
import StatusDot from "@/components/StatusDot";
import UptimeBar from "@/components/UptimeChart";

const mockSites = [
  {
    id: 1,
    name: "Production API",
    url: "https://api.mypms.com",
    status: "up",
    uptime: 99.98,
    responseTime: 142,
    lastChecked: "2s ago",
    incidents: 0,
    history: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
  },
  {
    id: 2,
    name: "Frontend App",
    url: "https://app.mypms.com",
    status: "up",
    uptime: 100,
    responseTime: 89,
    lastChecked: "1s ago",
    incidents: 0,
    history: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  },
  {
    id: 3,
    name: "Auth Service",
    url: "https://auth.mypms.com",
    status: "down",
    uptime: 97.42,
    responseTime: null,
    lastChecked: "3s ago",
    incidents: 2,
    history: [1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  },
  {
    id: 4,
    name: "Database Proxy",
    url: "https://db.mypms.com",
    status: "up",
    uptime: 99.71,
    responseTime: 204,
    lastChecked: "5s ago",
    incidents: 1,
    history: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  },
];

const stats = {
  totalSites: 4,
  upSites: 3,
  avgUptime: 99.28,
  avgResponse: 145,
  activeIncidents: 1,
};

export default function Dashboard() {
  const [sites, setSites] = useState(mockSites);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(null);

useEffect(() => {
  setTime(new Date());
  
  const t = setInterval(() => setTime(new Date()), 1000);
  return () => clearInterval(t);
}, []);

  const handleAdd = ({ name, url }) => {
    setSites(prev => [...prev, {
      id: prev.length + 1, name, url, status: "up",
      uptime: 100, responseTime: 0, lastChecked: "just now",
      incidents: 0, history: Array(36).fill(1),
    }]);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070b14",
      color: "#e2e8f0",
      fontFamily: "'DM Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #070b14; }
        ::-webkit-scrollbar-thumb { background: #1a1f2e; border-radius: 2px; }
        input::placeholder { color: #2d3748; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1a1f2e",
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "56px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "6px",
              background: "linear-gradient(135deg, #00ff88 0%, #00b4d8 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "#070b14" }}>▲</span>
            </div>
            <span style={{ fontSize: "13px", fontWeight: "500", letterSpacing: "0.15em", color: "#e2e8f0" }}>
              UPTIMEWATCH
            </span>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            {["MONITORS", "INCIDENTS", "STATUS PAGES", "SETTINGS"].map(item => (
              <span key={item} style={{
                fontSize: "11px", color: item === "MONITORS" ? "#00ff88" : "#4a5568",
                letterSpacing: "0.08em", cursor: "pointer",
                borderBottom: item === "MONITORS" ? "1px solid #00ff88" : "none",
                paddingBottom: "2px",
              }}>{item}</span>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "11px", color: "#2d3748", letterSpacing: "0.05em" }}>
            {time ? time.toLocaleTimeString("en-GB") : "--:--:--"} EAT
          </span>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "#00ff88", color: "#070b14", border: "none",
              borderRadius: "6px", padding: "7px 14px", fontSize: "11px",
              fontWeight: "700", cursor: "pointer", letterSpacing: "0.08em",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            + ADD MONITOR
          </button>
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "12px", marginBottom: "32px" }}>
          {[
            { label: "TOTAL MONITORS", value: stats.totalSites, unit: "" },
            { label: "OPERATIONAL", value: stats.upSites, unit: `/ ${stats.totalSites}`, color: "#00ff88" },
            { label: "AVG UPTIME", value: stats.avgUptime, unit: "%", color: "#00ff88" },
            { label: "AVG RESPONSE", value: stats.avgResponse, unit: "ms" },
            { label: "ACTIVE INCIDENTS", value: stats.activeIncidents, unit: "", color: stats.activeIncidents > 0 ? "#ff3b5c" : "#00ff88" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "#0a0e1a", border: "1px solid #1a1f2e",
              borderRadius: "8px", padding: "16px 18px",
            }}>
              <div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "0.1em", marginBottom: "8px" }}>
                {stat.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span style={{ fontSize: "22px", fontWeight: "500", color: stat.color || "#e2e8f0", fontFamily: "'Syne', sans-serif" }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: "11px", color: "#4a5568" }}>{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Active Incident Banner */}
        {stats.activeIncidents > 0 && (
          <div style={{
            background: "rgba(255, 59, 92, 0.08)", border: "1px solid rgba(255,59,92,0.2)",
            borderRadius: "8px", padding: "12px 18px", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <span style={{ color: "#ff3b5c", fontSize: "11px" }}>●</span>
            <span style={{ color: "#ff3b5c", fontSize: "12px", letterSpacing: "0.05em" }}>
              ACTIVE INCIDENT — Auth Service has been down for 14 minutes
            </span>
            <span style={{ marginLeft: "auto", color: "#ff3b5c", fontSize: "11px", cursor: "pointer" }}>
              VIEW →
            </span>
          </div>
        )}

        {/* Sites Table */}
        <div style={{
          background: "#0a0e1a", border: "1px solid #1a1f2e",
          borderRadius: "10px", overflow: "hidden",
        }}>
          {/* Table Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 2fr",
            padding: "12px 20px",
            borderBottom: "1px solid #1a1f2e",
            gap: "12px",
          }}>
            {["MONITOR", "UPTIME", "RESPONSE", "CHECKED", "LAST 36 CHECKS"].map(h => (
              <span key={h} style={{ fontSize: "10px", color: "#2d3748", letterSpacing: "0.1em" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {sites.map(site => (
            <SiteRow key={site.id} site={site} onClick={setSelected} />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "20px", display: "flex",
          justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: "11px", color: "#2d3748" }}>
            Checks run every 5 minutes · All times in EAT
          </span>
          <span style={{ fontSize: "11px", color: "#2d3748" }}>
            {sites.length} monitors active
          </span>
        </div>
      </div>

      {/* Site Detail Panel */}
      {selected && (
        <div style={{
          position: "fixed", right: 0, top: 0, bottom: 0, width: "360px",
          background: "#0a0e1a", borderLeft: "1px solid #1a1f2e",
          padding: "28px", overflowY: "auto", zIndex: 50,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", letterSpacing: "0.1em", color: "#4a5568" }}>MONITOR DETAIL</span>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#4a5568", cursor: "pointer" }}>✕</button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <StatusDot status={selected.status} />
            <div>
              <div style={{ fontSize: "16px", fontWeight: "500", color: "#e2e8f0", fontFamily: "'Syne', sans-serif" }}>{selected.name}</div>
              <div style={{ fontSize: "11px", color: "#4a5568", marginTop: "2px" }}>{selected.url}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
            {[
              { label: "UPTIME", value: `${selected.uptime}%` },
              { label: "RESPONSE", value: selected.responseTime ? `${selected.responseTime}ms` : "—" },
              { label: "INCIDENTS", value: selected.incidents },
              { label: "LAST CHECK", value: selected.lastChecked },
            ].map((item, i) => (
              <div key={i} style={{
                background: "#070b14", border: "1px solid #1a1f2e",
                borderRadius: "6px", padding: "12px",
              }}>
                <div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "0.1em", marginBottom: "6px" }}>{item.label}</div>
                <div style={{ fontSize: "16px", color: "#e2e8f0", fontFamily: "'Syne', sans-serif" }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "10px", color: "#4a5568", letterSpacing: "0.1em", marginBottom: "10px" }}>UPTIME HISTORY</div>
            <UptimeBar history={selected.history} />
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
            <button style={{
              flex: 1, background: "transparent", border: "1px solid #1a1f2e",
              color: "#4a5568", borderRadius: "6px", padding: "9px",
              fontSize: "11px", cursor: "pointer", fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.06em",
            }}>
              VIEW STATUS PAGE
            </button>
            <button style={{
              flex: 1, background: "transparent", border: "1px solid #ff3b5c",
              color: "#ff3b5c", borderRadius: "6px", padding: "9px",
              fontSize: "11px", cursor: "pointer", fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.06em",
            }}>
              REMOVE
            </button>
          </div>
        </div>
      )}

      {showModal && <AddSiteModal onClose={() => setShowModal(false)} onAdd={handleAdd} />}
    </div>
  );
}