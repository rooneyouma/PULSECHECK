"use client";
import { useQuery } from "@tanstack/react-query";

export default function IncidentsTab() {
  const { data: incidents, isLoading, isError } = useQuery({
    queryKey: ["/incidents/?page=1"], // Assuming first page only for the tab demo
    refetchInterval: 10000,
  });

  if (isLoading) return <div style={{ padding: "48px", color: "#4a5568", fontSize: "12px", textAlign: "center" }}>LOADING INCIDENTS...</div>;
  if (isError) return <div style={{ padding: "48px", color: "#ff3b5c", fontSize: "12px", textAlign: "center" }}>FAILED TO LOAD INCIDENTS</div>;

  return (
    <div style={{
      background: "#0a0e1a", border: "1px solid #1a1f2e",
      borderRadius: "10px", overflow: "hidden",
    }}>
      <div className="mobile-table-header" style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        padding: "12px 20px",
        borderBottom: "1px solid #1a1f2e",
        gap: "12px",
      }}>
        {["MONITOR", "STATUS", "STARTED AT", "RESOLVED AT"].map(h => (
          <span key={h} style={{ fontSize: "10px", color: "#2d3748", letterSpacing: "0.1em" }}>{h}</span>
        ))}
      </div>
      {incidents?.results && incidents.results.length > 0 ? incidents.results.map(inc => (
        <div className="mobile-grid-1" key={inc.id} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
          padding: "16px 20px", borderBottom: "1px solid #1a1f2e", gap: "12px", alignItems: "center"
        }}>
          <span style={{ fontSize: "13px", color: "#e2e8f0" }}>{inc.site_name}</span>
          <span style={{ fontSize: "11px", color: inc.resolved_at ? "#00ff88" : "#ff3b5c" }}>
            {inc.resolved_at ? "RESOLVED" : "ACTIVE"}
          </span>
          <span style={{ fontSize: "11px", color: "#4a5568" }}>
            {new Date(inc.started_at).toLocaleString("en-GB", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
          <span style={{ fontSize: "11px", color: "#4a5568" }}>
            {inc.resolved_at ? new Date(inc.resolved_at).toLocaleString("en-GB", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : "—"}
          </span>
        </div>
      )) : (
        <div style={{ padding: "48px", textAlign: "center", color: "#4a5568", fontSize: "12px", letterSpacing: "0.05em" }}>
          NO INCIDENTS RECORDED
        </div>
      )}
    </div>
  );
}
