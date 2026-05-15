"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SiteRow from "@/components/SiteCard";
import AddSiteModal from "@/components/AddSiteModal";
import StatusDot from "@/components/StatusDot";
import UptimeBar from "@/components/UptimeChart";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [time, setTime] = useState(null);


  const { data: sites = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["/sites/"],
    refetchInterval: 10000, 
  });

 
  const stats = {
    totalSites: sites.length,
    upSites: sites.filter(s => s.status === "up" || s.status === "operational").length,
    avgUptime: sites.length 
      ? parseFloat((sites.reduce((acc, s) => acc + (s.uptime || 100), 0) / sites.length).toFixed(2)) 
      : 100,
    avgResponse: sites.length
      ? Math.round(sites.reduce((acc, s) => acc + (s.responseTime || s.last_response_time || 0), 0) / sites.length)
      : 0,
    activeIncidents: sites.filter(s => s.status === "down").length,
  };

 
  const currentSelectedDetail = selected ? sites.find(s => s.id === selected.id) || selected : null;

  useEffect(() => {
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#070b14", color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace" }}>
        <span style={{ fontSize: "12px", color: "#4a5568", letterSpacing: "0.1em" }}>LOADING REALTIME MONITOR DATA...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ minHeight: "100vh", background: "#070b14", color: "#ff3b5c", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace" }}>
        <span style={{ fontSize: "12px", letterSpacing: "0.1em" }}>FAILED TO CONNECT TO MONITOR BACKEND ENGINE</span>
      </div>
    );
  }

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
              ACTIVE INCIDENT — {stats.activeIncidents} of your tracked endpoints are reporting operational outages
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

          {/* Real Backend Map Rows */}
          {sites.length > 0 ? (
            sites.map(site => (
              <SiteRow key={site.id} site={site} onClick={setSelected} />
            ))
          ) : (
            <div style={{ padding: "48px", textAlign: "center", color: "#4a5568", fontSize: "12px", letterSpacing: "0.05em" }}>
              NO MONITORS REGISTERED ON CORE ENGINE NETWORK
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: "20px", display: "flex",
          justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: "11px", color: "#2d3748" }}>
            Checks run automatically via pipeline systems · All times in EAT
          </span>
          <span style={{ fontSize: "11px", color: "#2d3748" }}>
            {sites.length} monitors active
          </span>
        </div>
      </div>

      {/* Site Detail Panel */}
      {currentSelectedDetail && (
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
            <StatusDot status={currentSelectedDetail.status} />
            <div>
              <div style={{ fontSize: "16px", fontWeight: "500", color: "#e2e8f0", fontFamily: "'Syne', sans-serif" }}>{currentSelectedDetail.name}</div>
              <div style={{ fontSize: "11px", color: "#4a5568", marginTop: "2px" }}>{currentSelectedDetail.url}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
            {[
              { label: "UPTIME", value: `${currentSelectedDetail.uptime || 100}%` },
              { label: "RESPONSE", value: (currentSelectedDetail.responseTime || currentSelectedDetail.last_response_time) ? `${currentSelectedDetail.responseTime || currentSelectedDetail.last_response_time}ms` : "—" },
              { label: "INCIDENTS", value: currentSelectedDetail.incidents ?? 0 },
              { label: "LAST CHECK", value: currentSelectedDetail.lastChecked || currentSelectedDetail.last_checked || "just now" },
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
            <UptimeBar history={currentSelectedDetail.history || currentSelectedDetail.ping_history || []} />
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

      {showModal && <AddSiteModal onClose={() => setShowModal(false)} onAdd={refetch} />}
    </div>
  );
}